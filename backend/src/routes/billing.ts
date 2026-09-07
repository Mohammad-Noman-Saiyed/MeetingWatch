import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { pool } from "../db";
import {
  stripe,
  STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SECRET,
} from "../billing/stripe";
import { requireAuth } from "../auth/middleware";

const router = Router();

const FRONTEND_URL = "http://localhost:5173";

router.post("/checkout", requireAuth, async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT email, is_premium, stripe_customer_id FROM users WHERE id = $1",
    [req.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = result.rows[0];

  if (user.is_premium) {
    return res
      .status(409)
      .json({ error: "You are already on the Premium plan" });
  }

  let customerId = user.stripe_customer_id;

  try {
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;

      await pool.query(
        "UPDATE users SET stripe_customer_id = $1 WHERE id = $2",
        [customerId, req.userId],
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${FRONTEND_URL}/dashboard?upgraded=true`,
      cancel_url: `${FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    return res
      .status(503)
      .json({ error: "Could not start checkout right now, please try again" });
  }
});

router.post("/portal", requireAuth, async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT stripe_customer_id FROM users WHERE id = $1",
    [req.userId],
  );

  const customerId = result.rows[0]?.stripe_customer_id;

  if (!customerId) {
    return res.status(400).json({ error: "No billing account found" });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe billing portal failed:", err);
    return res
      .status(503)
      .json({ error: "Could not open billing portal right now, please try again" });
  }
});

router.post("/webhook", async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({ error: "Missing Stripe signature header" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).json({ error: "Invalid Stripe signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await pool.query(
      "UPDATE users SET is_premium = true, stripe_subscription_id = $1 WHERE stripe_customer_id = $2",
      [session.subscription, session.customer],
    );
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    await pool.query(
      "UPDATE users SET is_premium = false, stripe_subscription_id = NULL WHERE stripe_customer_id = $1",
      [subscription.customer],
    );
  }

  res.json({ received: true });
});

export default router;
