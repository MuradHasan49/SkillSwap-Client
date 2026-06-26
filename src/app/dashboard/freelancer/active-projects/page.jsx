import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import Link from "next/link";
import { DollarSign, CalendarDays } from "lucide-react";
import ActiveProjectActions from "./ActiveProjectActions";

export const metadata = { title: "Active Projects - SkillSwap" };

export default async function ActiveProjectsPage() {
  const user = await requireRole("freelancer");
  const db = await getDb();
  
  // Find accepted proposals
  const acceptedProposals = await db.collection("proposals")
    .find({ freelancer_email: user.email, status: "accepted" })
    .toArray();
    
  const taskIds = acceptedProposals.map(p => p.task_id);
  const tasks = await db.collection("tasks").find({ _id: { $in: taskIds.map(id => new (require("mongodb").ObjectId)(id)) } }).toArray();
  
  const activeTasks = tasks.filter(t => t.status === "in-progress" || t.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Projects</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your ongoing work and submit deliverables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTasks.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-gray-500">
            You don't have any active projects right now. Start by applying to tasks!
          </div>
        ) : (
          activeTasks.map(task => (
            <div key={task._id.toString()} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                  {task.status.replace("_", " ").toUpperCase()}
                </span>
                <span className="font-bold text-green-600 dark:text-green-400 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />{task.budget}
                </span>
              </div>
              
              <Link href={`/tasks/${task._id.toString()}`} className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                {task.title}
              </Link>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" /> Due: {new Date(task.deadline).toLocaleDateString()}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                <ActiveProjectActions taskId={task._id.toString()} status={task.status} deliverableUrl={task.deliverable_url} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
