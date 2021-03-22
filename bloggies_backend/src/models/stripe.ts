import Stripe from "stripe";
import ExpressError from "../expressError";
import {STRIPE_API_KEY} from '../config';

/* create new Stripe instance to facilitate interactions with Stripe API*/
const stripe = new Stripe(STRIPE_API_KEY as string, {
  apiVersion: "2020-08-27",
});

export default class Checkout {
  /** create a new checkout session
   * takes in a priceId, which is the id associated with the Learning Circle Subscription created in Stripe
   * example priceId = price_1IULb0E8sgH3eli5Ol7qktPn
  */
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

  static async stripeSubscriptionCancel() {
    return 'User wants to delete subscription - logic not yet set up'
  }


  static async stripeCreateCustomer(userId: number) {
    const newCustomer = await stripe.customers.create({
      description: userId.toString()
    });
    return newCustomer.id;
  }

  static async stripeCreateSubscription() {

  }
}
