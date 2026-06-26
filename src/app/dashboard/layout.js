"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Activity, CalendarCheck2, Users, WalletCards, MessageSquareText, Dumbbell, UserRound, LogOut, Menu, ShieldCheck, Sparkles, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const ROLE_NAV = {
  client: [
    { name: "Dashboard", href: "/dashboard/client", icon: LayoutDashboard },
    { name: "Post a Task", href: "/dashboard/client/post-task", icon: Activity },
    { name: "My Tasks", href: "/dashboard/client/tasks", icon: CalendarCheck2 },
    { name: "Manage Proposals", href: "/dashboard/client/proposals", icon: Users },
    { name: "Payment History", href: "/dashboard/client/transactions", icon: WalletCards },
  ],
  freelancer: [
    { name: "Dashboard", href: "/dashboard/freelancer", icon: LayoutDashboard },
    { name: "Browse Tasks", href: "/tasks", icon: Search },
    { name: "My Proposals", href: "/dashboard/freelancer/proposals", icon: MessageSquareText },
    { name: "Active Projects", href: "/dashboard/freelancer/active-projects", icon: Dumbbell },
    { name: "My Earnings", href: "/dashboard/freelancer/earnings", icon: WalletCards },
    { name: "Edit Profile", href: "/dashboard/freelancer/profile", icon: UserRound },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Tasks", href: "/dashboard/admin/tasks", icon: CalendarCheck2 },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: WalletCards },
  ],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/get-session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          let currentRole = (session.user.role || session.user.initialRole || "client").toLowerCase();
          if (currentRole === "user") currentRole = "client";
          setRole(currentRole);
          setUser(session.user);
        } else {
          router.push("/login");
        }
      });
  }, [router]);

  if (!role) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const links = ROLE_NAV[role] || [];
  
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login")
      }
    });
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          SkillSwap
        </Link>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-bold flex items-center justify-center uppercase shrink-0">
              {user?.name ? user.name.substring(0, 2) : "US"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 w-max mt-0.5 capitalize">
                {role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button onClick={() => setIsMobileOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMobileOpen(true)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-4 text-xl font-bold text-indigo-600 dark:text-indigo-400">SkillSwap</span>
          </div>
          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{role} Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm" className="hidden sm:flex text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
              <Link href="/">
                Return to Website
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
