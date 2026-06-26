import { NextResponse } from "next/navigation";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const db = await getDb();
      const metadata = session.metadata;

      // Check if payment already recorded
      const existing = await db.collection("payments").findOne({ stripe_session_id: session.id });
      
      if (!existing) {
        // Record payment
        await db.collection("payments").insertOne({
          stripe_session_id: session.id,
          task_id: metadata.taskId,
          proposal_id: metadata.proposalId,
          client_email: metadata.clientEmail,
          freelancer_email: metadata.freelancerEmail,
          amount: parseFloat(metadata.amount),
          paid_at: new Date(),
        });

        // Update task status
        await db.collection("tasks").updateOne(
          { _id: new ObjectId(metadata.taskId) },
          { $set: { status: "in-progress" } }
        );
      }

      const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.redirect(`${origin}/dashboard/client/tasks`);
    } else {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment Success Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
