"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#ef4444', '#3b82f6', '#10b981']; // Red for Admin, Blue for Client, Green for Freelancer

export function AdminCharts({ usersByRole, tasksByStatus }) {
  // Format Users Data
  const roleData = [
    { name: 'Admin', value: usersByRole.find(u => u._id === 'admin')?.count || 0 },
    { name: 'Client', value: usersByRole.find(u => u._id === 'client')?.count || 0 },
    { name: 'Freelancer', value: usersByRole.find(u => u._id === 'freelancer')?.count || 0 },
  ].filter(d => d.value > 0);

  // Format Tasks Data
  const statusData = [
    { name: 'Open', value: tasksByStatus.find(t => t._id === 'open')?.count || 0, fill: '#f59e0b' },
    { name: 'Completed', value: tasksByStatus.find(t => t._id === 'completed')?.count || 0, fill: '#10b981' },
    { name: 'In Progress', value: tasksByStatus.find(t => t._id === 'in-progress')?.count || 0, fill: '#3b82f6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Users by Role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Admin</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Client</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Freelancer</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
