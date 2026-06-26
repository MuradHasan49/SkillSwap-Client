import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import AdminUserActions from "./AdminUserActions";
import Image from "next/image";

export const metadata = { title: "Manage Users - SkillSwap Admin" };

export default async function AdminUsersPage() {
  await requireRole("admin");
  const db = await getDb();
  
  const users = await db.collection("user").find({}).sort({ createdAt: -1 }).toArray();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h2>
        <p className="text-gray-500 dark:text-gray-400">View and manage all clients and freelancers on the platform.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">User</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {users.map((user) => (
                <tr key={user._id.toString()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                      {user.image ? (
                        <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      {user.isBlocked && <span className="text-xs text-red-500 font-bold">BLOCKED</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      user.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                      user.role === "client" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== "admin" && (
                      <AdminUserActions email={user.email} isBlocked={user.isBlocked} />
                    )}
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
