import Checkout from '../models/stripe';
import express, {Request, Response, NextFunction} from "express";
// import { ensureLoggedIn } from "../middleware/auth";

export const stripeRouter = express.Router();

/** POST /create-checkout-session - creates a new checkout session.
 * Returns session id, currently not checking if user logged in */
stripeRouter.post("/create-checkout-session", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const {priceId}= req.body;
    const session = await Checkout.stripeCheckout(priceId);
    res.status(201).send({sessionId: session.id})
  } catch (err) {
    return next(err);
  }
});

/** DELETE cancels user's Stripe subscription */
stripeRouter.delete("/cancel-subscription", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const cancel = await Checkout.stripeSubscriptionCancel();
    res.send(cancel);
  } catch(err) {
    return next(err);
  }
});