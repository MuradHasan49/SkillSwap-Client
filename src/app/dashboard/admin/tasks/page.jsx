import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import AdminTaskActions from "./AdminTaskActions";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata = { title: "Manage Tasks - SkillSwap Admin" };

export default async function AdminTasksPage() {
  await requireRole("admin");
  const db = await getDb();
  
  const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Tasks</h2>
        <p className="text-gray-500 dark:text-gray-400">View and manage all tasks on the platform.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Task Title</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Client Email</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Budget</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {tasks.map((task) => (
                <tr key={task._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {task.title}
                      <Link href={`/tasks/${task._id.toString()}`} target="_blank">
                        <ExternalLink className="w-4 h-4 text-indigo-500 hover:text-indigo-700" />
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500">{task.category}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {task.client_email}
                  </td>
                  <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">
                    ${task.budget}
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
                    <AdminTaskActions taskId={task._id.toString()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
