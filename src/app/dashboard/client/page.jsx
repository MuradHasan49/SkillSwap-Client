import { getDb } from "@/lib/db";
import { getUserSession, requireRole } from "@/lib/core/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, DollarSign } from "lucide-react";

export const metadata = { title: "Client Dashboard - SkillSwap" };

export default async function ClientDashboardPage() {
  const user = await requireRole("client");
  const db = await getDb();
  
  // Dashboard Main Statistics
  // Total Tasks, Open Tasks, Tasks In Progress, Total Spent (USD)
  
  const tasks = await db.collection("tasks").find({ client_email: user.email }).toArray();
  const totalTasks = tasks.length;
  const openTasks = tasks.filter(t => t.status === "open").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  
  const payments = await db.collection("payments").find({ client_email: user.email }).toArray();
  const totalSpent = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}!</h2>
        <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your projects today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks Posted</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
        {tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-400">
              <Activity className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">No tasks yet</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Post your first task to find talented freelancers</p>
            </div>
            <a href="/dashboard/client/post-task" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 mt-2">
              Post a Task
            </a>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Task Title</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Budget</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-[250px]">{task.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "open" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          task.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300"
                        }`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        ${task.budget}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a href={`/tasks/${task._id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
