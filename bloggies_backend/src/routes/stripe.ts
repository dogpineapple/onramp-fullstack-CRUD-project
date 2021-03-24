import Checkout from '../models/stripe';
import express, { Request, Response, NextFunction } from "express";
import Stripe from 'stripe';
import User from '../models/user';
import { ensureLoggedIn } from "../middleware/auth";
import { MY_STRIPE_API_KEY } from '../config';
import ExpressError from '../expressError';
export const stripeRouter = express.Router();

/* create new Stripe instance to facilitate interactions with Stripe API*/
export const stripe = new Stripe(MY_STRIPE_API_KEY as string, {
  apiVersion: "2020-08-27",
});

/** GET handles events that occur over a stripe session via webhook */
stripeRouter.post("/webhook", async function (req: Request, res: Response, next: NextFunction) {
  let event = req.body;
  let data: any;
  let sub: Stripe.Subscription;

  switch (event.type) {
    case 'invoice.upcoming':
      data = event.data.object;
      console.log(`invoice upcoming, subscription almost ending for  cust ${data.customer}`);
    case 'invoice.paid':
      data = event.data.object;
      console.log(`invoice PAID for: ${data.customer}`);
      sub = await stripe.subscriptions.retrieve(data.subscription);
      await User.startSubscription(sub.id, sub.current_period_start, sub.current_period_end);
      break;
    case 'invoice.payment_failed':
      data = event.data.object;
      console.log(`invoice failed for: ${data.customer}`);
      sub = await stripe.subscriptions.retrieve(data.subscription);
      await User.cancelSubscription(data.subscription, sub.current_period_end);
      break;
    case 'customer.subscription.deleted':
      console.log("subscription deleted");
      data = event.data.object;
      sub = await stripe.subscriptions.retrieve(data.subscription);
      await User.cancelSubscription(data.subscription, sub.current_period_end);
      break;
    case 'payment_intent.succeeded':
      console.log(`PaymentIntent success for ${event.data.object.amount}`);
      break;
    default:
      console.log("web hook default, unhandled event", event.type);
      break;
  }

  return res.json({ received: true });
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


/** POST create a customer for a user */
stripeRouter.post("/create-customer", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const { user_id, email } = req.user;
  const user = await User.getUser(user_id);

  if (!user.customer_id) {
    const customer = await Checkout.stripeCreateCustomer(user_id, email);

    await User.updateUser(user_id, { customer_id: customer.id });
    return res.status(201).json({ customer });
  }

  return next(new ExpressError("Customer id already exists for this user.", 400));
});

/** POST create a subscription for a customer and save payment method  */
stripeRouter.post("/create-subscription", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction) {
  const { paymentMethodId, customerId } = req.body;
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

  return res.status(201).json({ subscription });
});

/** DELETE cancels user's Stripe subscription */
stripeRouter.delete("/cancel-subscription", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const cancelledSubscription = await Checkout.stripeSubscriptionCancel(req.body.subscription_id);
    res.send(cancelledSubscription);
  } catch (err) {
    return next(err);
  }
});

/** POST update the customer with new payment method and assign it as the new default payment for subscription invoices */
stripeRouter.post("/retry-invoice", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { customer_id, paymentMethodId, invoiceId } = req.body;

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer_id
    });
    // update the customer with the payment method
    await stripe.customers.update(customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ['payment_intent']
    });

    res.status(201).json(invoice);
  } catch (err) {
    const expressErr = new ExpressError(err, 402);
    // card_decline error
    return next(expressErr);
  }
});