import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";

export const metadata = { title: "Transactions - SkillSwap Admin" };

export default async function AdminTransactionsPage() {
  await requireRole("admin");
  const db = await getDb();
  
  const payments = await db.collection("payments").find({}).sort({ paid_at: -1 }).toArray();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
        <p className="text-gray-500 dark:text-gray-400">View all successful payments on the platform.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Transaction ID / Stripe</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Client Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Freelancer Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {payments.map((payment) => (
                  <tr key={payment._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {payment.stripe_session_id || payment._id.toString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {payment.client_email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {payment.freelancer_email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                      {new Date(payment.paid_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400 text-right">
                      ${payment.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
