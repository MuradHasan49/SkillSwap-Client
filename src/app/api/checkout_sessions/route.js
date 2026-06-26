import { NextResponse } from "next/navigation";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export async function GET(req) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const proposalId = searchParams.get("proposalId");

    if (!taskId || !proposalId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const db = await getDb();
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(taskId), client_email: user.email });
    const proposal = await db.collection("proposals").findOne({ _id: new ObjectId(proposalId), task_id: taskId });

    if (!task || !proposal) {
      return NextResponse.json({ error: "Task or proposal not found" }, { status: 404 });
    }

    // Create Checkout Session
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Task: ${task.title}`,
              description: `Freelancer: ${proposal.freelancer_email}`,
            },
            unit_amount: Math.round(proposal.proposed_budget * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/api/payment_success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/client/proposals`,
      metadata: {
        taskId: taskId,
        proposalId: proposalId,
        clientEmail: user.email,
        freelancerEmail: proposal.freelancer_email,
        amount: proposal.proposed_budget.toString(),
      },
    });

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
