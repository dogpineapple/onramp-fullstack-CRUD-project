import Checkout from '../models/stripe';
import express, { Request, Response, NextFunction } from "express";
import Stripe from 'stripe';
import User from '../models/user';
import { ensureLoggedIn } from "../middleware/auth";
import { TEST_STRIPE_API_KEY } from '../config';
import ExpressError from '../expressError';

export const stripeRouter = express.Router();

export const stripe = new Stripe(TEST_STRIPE_API_KEY as string, {
  apiVersion: "2020-08-27",
});

/** POST /create-checkout-session - creates a new checkout session.
 * Returns session id, currently not checking if user logged in */
stripeRouter.post("/create-checkout-session", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { priceId } = req.body;
    const session = await Checkout.stripeCheckout(priceId);
    res.status(201).send({ sessionId: session.id })
  } catch (err) {
    return next(err);
  }
});

stripeRouter.get("/webhook", async function (req: Request, res: Response, next: NextFunction) {
  let event = req.body;

  switch (event.type) {

    case 'invoice.paid':
      console.log("invoice paid");
      break;
    case 'invoice.payment_failed':
      console.log("invoice failed");
      break;
    case 'customer.subscription.deleted':
      console.log("subscription deleted");
      break;
    case 'payment_intent.succeeded':
      console.log("success");
      break;
    case 'payment_method.attached':
      console.log("attached");
      break;
    default:
      console.log("web hook default, unhandled event", event.type);
  }

  return res.json({ received: true });
});

/** POST create a customer for a user */
stripeRouter.post("/create-customer", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const { user_id, email } = req.user;
  const customer = await Checkout.stripeCreateCustomer(user_id, email);

  await User.updateUser(user_id, { customer_id: customer.id });

  return res.json({ customer });
});

/** POST create a subscription for a customer and save payment method  */
stripeRouter.post("/create-subscription", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const { paymentMethodId, customerId } = req.body

  try {
    // save payment method info for a customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });
  } catch (err) {
    const expressErr = new ExpressError(err, 402);
    return next(expressErr);
  }

  // update the customer with the payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  });

  const subscription = await Checkout.stripeCreateSubscription(customerId);

  await User.updateUser(req.user.user_id, { subscription_id: subscription.id });

  return res.json({ subscription });
});

/** DELETE cancels user's Stripe subscription */
stripeRouter.delete("/cancel-subscription", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const cancel = await Checkout.stripeSubscriptionCancel();
    res.send(cancel);
  } catch (err) {
    return next(err);
  }
});