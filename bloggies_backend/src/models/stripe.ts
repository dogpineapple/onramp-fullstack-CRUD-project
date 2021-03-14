import Stripe from "stripe";
require("dotenv").config({ path: require("find-config")(".env") });
import ExpressError from "../expressError";

/* create new Stripe instance to facilitate interactions with Stripe API*/
const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
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
    } catch (e) {
      throw new ExpressError(`Err: ${e}`, 400);
    }
  }
}
