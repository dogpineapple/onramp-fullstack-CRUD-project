import Stripe from "stripe";
import { PRICE_ID } from "../config";
import Checkout from "../models/stripe";
import { stripe } from "../routes/stripe";


const mockEmail = "test@test.com";
const mockUserId = 1;
const mockCard = {
  number: '4242424242424242',
  exp_month: 3,
  exp_year: 2022,
  cvc: '314',
}
const invalidCustomerId = "cus_123";
const invalidSubscriptionId = "sub_123";
let testCustomer: Stripe.Customer;
let testSubscription: Stripe.Subscription;

describe("Test Stripe class methods", function () {
  beforeAll(async function () {
    testCustomer = await stripe.customers.create({
      email: mockEmail
    });

    const paymentMethod = await stripe.paymentMethods.create({ type: "card", card: mockCard });
    try {
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: testCustomer.id
      });
    } catch (err) {
      fail("Stripe's PaymentMethod attach to Customer failed");
    }

    await stripe.customers.update(testCustomer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }
    });

    testSubscription = await stripe.subscriptions.create({
      customer: testCustomer.id, 
      items: [{
        plan: PRICE_ID
      }]
    });
  });

  test("Create a Stripe customer successfully", async function () {
    const newCustomer = await Checkout.stripeCreateCustomer(mockUserId, mockEmail);
    expect(newCustomer.id).toContain("cus");
    expect(newCustomer.email).toBe(mockEmail);
    expect(newCustomer.description).toBe(mockUserId.toString());

    await stripe.customers.del(newCustomer.id);
  });

  test("Create a Stripe subscription successfully for a customer, returns subscription", async function () {
    const subscription = await Checkout.stripeCreateSubscription(testCustomer.id);

    expect(subscription.id).toContain("sub");
    expect(subscription.customer).toBe(testCustomer.id);
  });

  test("Cancel a Stripe subscription successfully for a user, returns subscription", async function () {
    const cancelledSub = await Checkout.stripeSubscriptionCancel(testSubscription.id);
    expect(cancelledSub.id).toBe(testSubscription.id);
    expect(cancelledSub.canceled_at).toBeTruthy();
  });

  test("Handles invalid subscription id to cancel a subscription", async function () {
    try { 
     await Checkout.stripeSubscriptionCancel(invalidSubscriptionId);
    } catch (err) {
     expect(err.message).toBe(`No such subscription: ${invalidSubscriptionId}`);
     expect(err.status).toBe(400);
    }
  });

  test("Handles invalid customer id to cancel a customer", async function () {
    try { 
     await Checkout.stripeCreateSubscription(invalidCustomerId);
    } catch (err) {
     expect(err.message).toBe(`Customer ${invalidCustomerId} does not exist`);
     expect(err.status).toBe(400);
    }
  });

  test("Handles invalid customer id when creating a subscription", async function () {
    try { 
     await Checkout.stripeCreateSubscription(invalidCustomerId);
    } catch (err) {
     expect(err.message).toBe(`Customer ${invalidCustomerId} does not exist`);
     expect(err.status).toBe(400);
    }
  });

  afterAll(async function () {
    await stripe.customers.del(testCustomer.id);
  })
});