import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, CreditCard, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";
import ClientProposalActions from "./ClientProposalActions";

export const metadata = { title: "Manage Proposals - SkillSwap" };

export default async function ManageProposalsPage() {
  const user = await requireRole("client");
  const db = await getDb();
  
  // Get all tasks by client
  const tasks = await db.collection("tasks").find({ client_email: user.email }).toArray();
  const taskIds = tasks.map(t => t._id.toString());
  
  // Get proposals for those tasks
  const proposals = await db.collection("proposals")
    .find({ task_id: { $in: taskIds } })
    .sort({ submitted_at: -1 })
    .toArray();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Proposals</h2>
        <p className="text-gray-500 dark:text-gray-400">Review applications from freelancers and hire the best talent.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {proposals.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No proposals have been submitted for your tasks yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {proposals.map(proposal => {
              const task = tasks.find(t => t._id.toString() === proposal.task_id);
              return (
                <div key={proposal._id.toString()} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/tasks/${task._id.toString()}`} className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 hover:underline">
                          {task.title}
                        </Link>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proposal.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          proposal.status === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {proposal.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          <Link href={`/freelancers/${encodeURIComponent(proposal.freelancer_email)}`} className="hover:underline">
                            {proposal.freelancer_email}
                          </Link>
                        </span>
                        <span className="flex items-center"><CreditCard className="w-4 h-4 mr-1" /> ${proposal.proposed_budget}</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {proposal.estimated_days} Days</span>
                        <span className="flex items-center hidden sm:flex"><CalendarDays className="w-4 h-4 mr-1" /> {new Date(proposal.submitted_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-slate-700">
                        "{proposal.cover_note}"
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[140px] justify-start">
                      {proposal.status === "pending" && task.status === "open" && (
                        <ClientProposalActions 
                          proposalId={proposal._id.toString()} 
                          taskId={task._id.toString()} 
                        />
                      )}
                      {proposal.status === "accepted" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          ✓ Accepted & Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
