import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import ClientTaskActions from "./ClientTaskActions";
import { getClientTaskReviews } from "@/lib/core/reviews";

export const metadata = { title: "My Tasks - SkillSwap" };

export default async function MyTasksPage() {
  const user = await requireRole("client");
  const db = await getDb();
  
  const tasks = await db.collection("tasks")
    .find({ client_email: user.email })
    .sort({ createdAt: -1 })
    .toArray();
    
  const reviews = await getClientTaskReviews(user.email);
  const reviewedTaskIds = new Set(reviews.map(r => r.task_id));
  
  const tasksWithReviews = tasks.map(task => ({
    ...task,
    hasReviewed: reviewedTaskIds.has(task._id.toString())
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage all your posted tasks here.</p>
        </div>
        <Link href="/dashboard/client/post-task">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Post New Task</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't posted any tasks yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Task</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Budget</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Deadline</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {tasks.map((task) => (
                  <tr key={task._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.category}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">
                      ${task.budget}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === "open" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        task.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {task.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ClientTaskActions 
                        task={JSON.parse(JSON.stringify(tasksWithReviews.find(t => t._id === task._id)))} 
                      />
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
