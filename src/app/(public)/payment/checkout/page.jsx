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

    const startCheckout = async () => {
      try {
        const { processCheckout } = await import("./actions");
        const result = await processCheckout(proposalId);
        
        if (result.error) {
          setError(result.error);
          setStatus("error");
          return;
        }

        if (result.url) {
          window.location.href = result.url;
        } else {
          throw new Error("No checkout URL returned.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
        setStatus("error");
      }
    };

    startCheckout();
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
