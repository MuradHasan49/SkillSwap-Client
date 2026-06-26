"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const taskId = searchParams.get("taskId");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!proposalId) {
      setError("Missing proposal information.");
      setStatus("error");
      return;
    }

    const createSession = async () => {
      try {
        // Get JWT token via better-auth session
        const sessionRes = await fetch("/api/auth/get-session");
        const session = await sessionRes.json();
        console.log("Checkout session:", session);
        
        if (!session?.user) {
          setError("You must be logged in to make a payment.");
          setStatus("error");
          return;
        }

        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

        // Get JWT token from backend
        const jwtRes = await fetch(`${serverUrl}/auth/jwt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: session.user.email, role: session.user.role }),
        });

        if (!jwtRes.ok) {
          setError("Authentication failed.");
          setStatus("error");
          return;
        }

        // Create Stripe checkout session
        const checkoutRes = await fetch(`${serverUrl}/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ proposalId }),
        });

        if (!checkoutRes.ok) {
          const data = await checkoutRes.json();
          setError(data.message || "Failed to create checkout session.");
          setStatus("error");
          return;
        }

        const { url } = await checkoutRes.json();

        // Redirect to Stripe Checkout using the session URL
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("No checkout URL returned from server.");
        }

      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
        setStatus("error");
      }
    };

    createSession();
  }, [proposalId]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-red-100 dark:border-red-900/30 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Error</h2>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <Link href="/dashboard/client/proposals">
            <Button variant="outline" className="mt-2">← Back to Proposals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-slate-700 text-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preparing your payment…</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we redirect you to Stripe's secure checkout page.
        </p>
      </div>
    </div>
  );
}
