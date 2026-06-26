import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, Activity } from "lucide-react";
import { AdminCharts } from "./AdminCharts";

export const metadata = { title: "Admin Dashboard - SkillSwap" };

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const db = await getDb();
  
  // Aggregate Users
  const usersByRole = await db.collection("user").aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]).toArray();

  const totalUsers = usersByRole.reduce((acc, r) => acc + r.count, 0);
  const admins = usersByRole.find(r => r._id === 'admin')?.count || 0;
  const freelancers = usersByRole.find(r => r._id === 'freelancer')?.count || 0;
  const clients = usersByRole.find(r => r._id === 'client')?.count || 0;

  // Aggregate Tasks
  const tasksByStatus = await db.collection("tasks").aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]).toArray();

  const totalTasks = tasksByStatus.reduce((acc, r) => acc + r.count, 0);
  const activeTasks = tasksByStatus.find(r => r._id === 'in-progress')?.count || 0;

  // Payments
  const payments = await db.collection("payments").find().sort({ createdAt: -1 }).limit(10).toArray();
  const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform overview and management</p>
      </div>
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{totalUsers}</h3>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{admins} admin, {freelancers} freelancers, {clients} clients</p>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{totalTasks}</h3>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{activeTasks} active</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{payments.length} payments (Recent)</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{activeTasks}</h3>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Currently in progress</p>
          </CardContent>
        </Card>
      </div>

      <AdminCharts usersByRole={usersByRole} tasksByStatus={tasksByStatus} />

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Payments</h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100 dark:divide-slate-700">
            {payments.map((payment) => (
              <li key={payment._id.toString()} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{payment.task_title || "Task Payment"}</div>
                  <div className="text-xs text-gray-500 mt-1">{payment.client_email} → {payment.freelancer_email}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${payment.amount}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(payment.createdAt).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
            {payments.length === 0 && (
              <li className="p-8 text-center text-gray-500">No recent payments.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
