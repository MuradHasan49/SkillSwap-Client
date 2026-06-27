import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Freelancer Dashboard - SkillSwap" };

export default async function FreelancerDashboardPage() {
  const user = await requireRole("freelancer");
  const db = await getDb();
  
  const proposals = await db.collection("proposals")
    .find({ freelancer_email: user.email })
    .sort({ submitted_at: -1 })
    .toArray();
    
  const recentProposals = proposals.slice(0, 3);
  const recentTaskIds = recentProposals.map(p => p.task_id);
  const recentTasks = await db.collection("tasks").find({ _id: { $in: recentTaskIds.map(id => new (require("mongodb").ObjectId)(id)) } }).toArray();
  const totalProposals = proposals.length;
  const pendingProposals = proposals.filter(p => p.status === "pending").length;
  const acceptedProposals = proposals.filter(p => p.status === "accepted").length;
  
  const payments = await db.collection("payments").find({ freelancer_email: user.email }).toArray();
  const totalEarnings = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Freelancer Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your proposals and earnings</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link href="/tasks">
            <Search className="w-4 h-4 mr-2" />
            Browse Tasks
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Proposals</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{totalProposals}</h3>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Proposals submitted</p>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{pendingProposals}</h3>
              </div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{acceptedProposals}</h3>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Proposals accepted</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">${totalEarnings.toFixed(2)}</h3>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">From completed tasks</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Proposals</h3>
          {proposals.length > 0 && (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/freelancer/proposals">View all proposals</Link>
            </Button>
          )}
        </div>
        
        {proposals.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Task</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Budget</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {recentProposals.map((proposal) => {
                    const task = recentTasks.find(t => t._id.toString() === proposal.task_id);
                    return (
                      <tr key={proposal._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/tasks/${proposal.task_id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[250px] inline-block">
                            {task ? task.title : "Unknown Task"}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task?.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                            proposal.status === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            proposal.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {task?.status === "completed" ? "COMPLETED" : proposal.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                          ${proposal.proposed_budget}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                          {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-dashed rounded-xl p-12 text-center bg-gray-50/50 dark:bg-gray-900/20 flex flex-col items-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">No proposals yet</h4>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Browse available tasks and submit your first proposal
            </p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/tasks">Browse Tasks</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
