"use server";

import { getUserSession } from "@/lib/core/session";

export async function processCheckout(proposalId) {
  const sessionUser = await getUserSession();
  
  if (!sessionUser) {
    return { error: "You must be logged in to make a payment." };
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  try {
    // Get JWT token from backend
    const jwtRes = await fetch(`${serverUrl}/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: sessionUser.email, role: sessionUser.role }),
    });

    if (!jwtRes.ok) {
      return { error: "Authentication failed." };
    }

    const cookieHeader = jwtRes.headers.get("set-cookie");

    // Create Stripe checkout session
    const checkoutRes = await fetch(`${serverUrl}/create-checkout-session`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(cookieHeader ? { "Cookie": cookieHeader } : {})
      },
      body: JSON.stringify({ proposalId }),
    });

    if (!checkoutRes.ok) {
      const data = await checkoutRes.json().catch(() => ({}));
      return { error: data.message || "Failed to create checkout session." };
    }

    const { url } = await checkoutRes.json();
    
    if (url) {
      return { url };
    } else {
      return { error: "No checkout URL returned from server." };
    }
  } catch (err) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
