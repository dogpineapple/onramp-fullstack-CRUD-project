import Stripe from "stripe";
import * as dotenv from 'dotenv';
import ExpressError from "../expressError";

dotenv.config({ path: __dirname + '/../env'});

const {STRIPE_API_KEY} = process.env;

/* create new Stripe instance to facilitate interactions with Stripe API*/
const stripe = new Stripe(STRIPE_API_KEY as string, {
  apiVersion: "2020-08-27",
});

export default class Checkout {
  /** create a new checkout session */
  static async stripeCheckout(priceId: string) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url:
          "https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://example.com/canceled.html",
      });

      return session;
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }
}
