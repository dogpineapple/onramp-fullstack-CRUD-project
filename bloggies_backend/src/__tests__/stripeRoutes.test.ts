import Stripe from "stripe";
import request from "supertest";
import app from "../app";
import { PRICE_ID } from "../config";
import db from "../db";
import { ACCEPTED, ACTIVE } from "../membershipStatuses";
import User from "../models/user";
import UserAuth from "../models/userAuth";
import { stripe } from "../routes/stripe";

const INVALID_CUSTOMER_ID = "cus_notarealcustomerid";
const INVALID_SUB_ID = "sub_notarealsubid";
const TEST_EMAIL = "testStripe@test.com";
const mockCard = {
  number: '4242424242424242',
  exp_month: 3,
  exp_year: 2025,
  cvc: '314'
}
const mockInvalidCard = {
  number: '4000000000000002',
  exp_month: 3,
  exp_year: 2025,
  cvc: '314'
}
const mockValidFailedCard = {
  number: '4000000000000341',
  exp_month: 3,
  exp_year: 2025,
  cvc: '314'
}
let testPaymentMethod: Stripe.PaymentMethod;
let testSecondPaymentMethod: Stripe.PaymentMethod;
let testInvalidCardPaymentMethod: Stripe.PaymentMethod;
let testUserId: number;
let testToken: string;
let testCustomer: Stripe.Customer;
let testCustomerWithSub: Stripe.Customer;
let testSubscription: Stripe.Subscription;

describe("Test Stripe routes", function () {
  beforeAll(async function () {
    testPaymentMethod = await stripe.paymentMethods.create({ type: "card", card: mockCard });

    testSecondPaymentMethod = await stripe.paymentMethods.create({ type: "card", card: mockCard });

    testInvalidCardPaymentMethod = await stripe.paymentMethods.create({ type: "card", card: mockInvalidCard });

    testCustomerWithSub = await stripe.customers.create({
      email: TEST_EMAIL
    });

    await stripe.paymentMethods.attach(testPaymentMethod.id, {
      customer: testCustomerWithSub.id
    });

    await stripe.customers.update(testCustomerWithSub.id, {
      invoice_settings: {
        default_payment_method: testPaymentMethod.id
      }
    });

    testSubscription = await stripe.subscriptions.create({
      customer: testCustomerWithSub.id,
      items: [{
        plan: PRICE_ID
      }]
    });
  });
  
  beforeEach(async function () {
    jest.setTimeout(1000 * 60 * 10);
    await db.query("DELETE FROM user_auth");
    await db.query("DELETE FROM users");
  
    const userData = await UserAuth.register(TEST_EMAIL, 'password');
    testToken = userData.token;
    testUserId = userData.user.id;
  
    await User.createUser(testUserId, 'testStripe');
    await db.query(`UPDATE users SET membership_status = $1 WHERE user_id = $2`, [ACCEPTED, testUserId]);
  
    testCustomer = await stripe.customers.create({
      email: TEST_EMAIL
    });
  });

  test("POST /checkout/create-customer - Create a Customer for a user, return customer", async function () {
    const resp = await request(app)
      .post("/checkout/create-customer")
      .set("Cookie", [`token=${testToken}`]);

    const userResult = await db.query(`SELECT customer_id FROM users WHERE user_id = $1`, [testUserId]);
    const customerId = userResult.rows[0].customer_id;

    expect(resp.status).toBe(201);
    expect(resp.body.customer.id).toBe(customerId);
  });

  test("Invalid POST /checkout/create-customer - Prevent creating a Customer for a user with a customer_id, return customer", async function () {
    await db.query(`
    UPDATE users 
      SET customer_id = $1
      WHERE user_id = $2`,
      [INVALID_CUSTOMER_ID, testUserId]);

    const resp = await request(app)
      .post("/checkout/create-customer")
      .set("Cookie", [`token=${testToken}`]);

    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("Customer id already exists for this user.");
  });

  test("POST /checkout/create-subscription - Create a new subscription for an eligible user, return subscription", async function () {
    const resp = await request(app)
      .post("/checkout/create-subscription")
      .set("Cookie", [`token=${testToken}`])
      .send({
        paymentMethodId: testSecondPaymentMethod.id,
        customerId: testCustomer.id
      });

    const userResult = await db.query(`SELECT subscription_id FROM users WHERE user_id = $1`, [testUserId]);
    const subscriptionId = userResult.rows[0].subscription_id;

    expect(resp.status).toBe(201);
    expect(resp.body.subscription.id).toBe(subscriptionId);
  });

  test("Invalid POST /checkout/create-subscription - Handles improper arguments", async function () {
    const resp = await request(app)
      .post("/checkout/create-subscription")
      .set("Cookie", [`token=${testToken}`])
      .send({
        paymentMethodId: 298943,
        customerId: ["invalid", "arguments"]
      });

    expect(resp.status).toBe(500);
  });

  test("Invalid POST /checkout/create-subscription - Prevents creating multiple subscriptions", async function () {
    await db.query(`UPDATE users SET membership_status = $1 WHERE user_id = $2`, [ACTIVE, testUserId]);

    const resp = await request(app)
      .post("/checkout/create-subscription")
      .set("Cookie", [`token=${testToken}`])
      .send({
        paymentMethodId: testPaymentMethod.id,
        customerId: testCustomerWithSub.id
      });

    expect(resp.status).toBe(400);
    expect(resp.body.error.message).toBe("Cannot have multiple subscriptions active at once.");
  });

  test("DELETE /checkout/cancel-subscription - Cancels an active subscription succesfully, returns deleted subscription", async function () {
    const resp = await request(app)
      .delete("/checkout/cancel-subscription")
      .set("Cookie", [`token=${testToken}`])
      .send({
        subscription_id: testSubscription.id
      });

      expect(resp.status).toBe(200);
      expect(resp.body.cancelled_subscription.id).toBe(testSubscription.id);
  });

  test("Invalid DELETE /checkout/cancel-subscription - handles an invalid subscription id", async function () {
    const resp = await request(app)
      .delete("/checkout/cancel-subscription")
      .set("Cookie", [`token=${testToken}`])
      .send({
        subscription_id: INVALID_SUB_ID
      });

      expect(resp.status).toBe(400);
      expect(resp.body.error.message).toBe(`No such subscription: ${INVALID_SUB_ID}`)
  });

  test("Invalid POST /checkout/create-subscription - handles declined card payment method", async function () {
    const resp = await request(app)
      .post("/checkout/create-subscription")
      .set("Cookie", [`token=${testToken}`])
      .send({
        paymentMethodId: testInvalidCardPaymentMethod.id,
        customerId: testCustomer.id
      });;

      expect(resp.status).toBe(402);
      expect(resp.body.error.message).toBe("Your card was declined.");
  });

  test("POST /retry-invoice", async function () {
    // creating a failed subscription payment scenerio
    const failedPaymentMet = await stripe.paymentMethods.create({ type: "card", card: mockValidFailedCard });
    const cus = await stripe.customers.create({
      email: TEST_EMAIL
    });
    await stripe.paymentMethods.attach(failedPaymentMet.id, {
      customer: cus.id
    });
    await stripe.customers.update(cus.id, {
      invoice_settings: {
        default_payment_method: failedPaymentMet.id
      }
    });
    const sub = await stripe.subscriptions.create({
      customer: cus.id,
      items: [{
        plan: PRICE_ID
      }]
    });

    expect(sub.status).toBe("incomplete");

    // create a payment method with a valid card and call endpoint
    const newPaymentMet = await stripe.paymentMethods.create({ type: "card", card: mockCard });
 
    const resp = await request(app)
      .post("/checkout/retry-invoice")
      .set("Cookie", [`token=${testToken}`])
      .send({
        customer_id: cus.id,
        paymentMethodId: newPaymentMet.id,
        invoiceId: sub.latest_invoice
      });
    
    expect(resp.status).toBe(200);
    expect(resp.body.status).toBe("open");
  });
});