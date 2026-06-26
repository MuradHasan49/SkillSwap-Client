import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "My Proposals - SkillSwap" };

export default async function FreelancerProposalsPage() {
  const user = await requireRole("freelancer");
  const db = await getDb();
  
  const proposals = await db.collection("proposals")
    .find({ freelancer_email: user.email })
    .sort({ submitted_at: -1 })
    .toArray();
    
  // Fetch associated tasks
  const taskIds = proposals.map(p => p.task_id);
  const tasks = await db.collection("tasks").find({ _id: { $in: taskIds.map(id => new (require("mongodb").ObjectId)(id)) } }).toArray();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Proposals</h2>
          <p className="text-gray-500 dark:text-gray-400">Track the status of your submitted applications.</p>
        </div>
        <Link href="/tasks">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Find More Tasks</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {proposals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't submitted any proposals yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Task</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">My Bid</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date Sent</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {proposals.map((proposal) => {
                  const task = tasks.find(t => t._id.toString() === proposal.task_id);
                  return (
                    <tr key={proposal._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/tasks/${proposal.task_id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                          {task ? task.title : "Unknown Task"}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ${proposal.proposed_budget}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                        {new Date(proposal.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proposal.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          proposal.status === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {proposal.status.toUpperCase()}
                        </span>
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
