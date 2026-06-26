import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";

export const metadata = { title: "My Earnings - SkillSwap" };

export default async function FreelancerEarningsPage() {
  const user = await requireRole("freelancer");
  const db = await getDb();
  
  const payments = await db.collection("payments")
    .find({ freelancer_email: user.email })
    .sort({ paid_at: -1 })
    .toArray();
    
  const taskIds = payments.map(p => p.task_id);
  const tasks = await db.collection("tasks").find({ _id: { $in: taskIds.map(id => new (require("mongodb").ObjectId)(id)) } }).toArray();

  const totalEarnings = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Earnings</h2>
          <p className="text-gray-500 dark:text-gray-400">View your payout history and completed jobs.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">Total Lifetime Earnings</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't received any payments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Task</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Client</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date Paid</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {payments.map((payment) => {
                  const task = tasks.find(t => t._id.toString() === payment.task_id);
                  return (
                    <tr key={payment._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {task ? task.title : "Unknown Task"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {payment.client_email}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                        {new Date(payment.paid_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400 text-right">
                        +${payment.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
