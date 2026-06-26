import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata = { title: "Payment Successful - SkillSwap" };

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const session_id = params?.session_id;

  let paymentDetails = null;

  if (session_id) {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      // Call backend to confirm and record the payment
      const res = await fetch(`${serverUrl}/payment/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id }),
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        paymentDetails = data.payment;
      }
    } catch (e) {
      // Silent — page still shows success UI
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Payment Successful!</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Your payment has been confirmed. The freelancer can now start working on your task.
          </p>
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Client</span>
              <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{paymentDetails.client_email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Freelancer</span>
              <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{paymentDetails.freelancer_email}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 dark:border-slate-700 pt-3">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-xl font-black text-green-600 dark:text-green-400">${paymentDetails.amount}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/client/tasks" className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md">
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/tasks" className="flex-1">
            <Button variant="outline" className="w-full font-bold py-3 rounded-xl">
              Browse More Tasks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
