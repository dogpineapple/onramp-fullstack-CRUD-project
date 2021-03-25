import ExpressError from "../expressError";
import {PRODUCT_ID} from '../config';
import { stripe } from '../routes/stripe';


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

  static async stripeSubscriptionCancel(subscriptionId: string) {
    const deletedSubscription = await stripe.subscriptions.del(subscriptionId);
    return deletedSubscription;
  }

  static async stripeCreateCustomer(userId: number, email: string, paymentMethodId?: string) {
    const newCustomer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: email,
      description: userId.toString(),
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    return newCustomer;
  }

  static async stripeCreateSubscription(customerId: string) {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      cancel_at: Date.now(),
      items: [{
        plan: PRODUCT_ID,
      }],
      expand: ["latest_invoice.payment_intent"]
    });
    return subscription;
  }

  static async stripeUpdateSubscription(customerId: string) {
    
  }

}
