import Link from "next/link";
import { Mail } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Browse Tasks", href: "/tasks" },
  { name: "Browse Freelancers", href: "/freelancers" },
  { name: "Post a Task", href: "/dashboard/client/post-task" },
  { name: "Register", href: "/register" },
];

const CATEGORIES = [
  { name: "Design", href: "/tasks?category=Design" },
  { name: "Writing", href: "/tasks?category=Writing" },
  { name: "Development", href: "/tasks?category=Development" },
  { name: "Marketing", href: "/tasks?category=Marketing" },
  { name: "Other", href: "/tasks?category=Other" },
];

export function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-14">

        {/* Top: Brand + Tagline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-gray-800">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-tight text-indigo-400 select-none">
                Skill<span className="text-white">Swap</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              The fast freelance marketplace for micro-tasks. Post a job, hire talent, and get things done.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-indigo-400" />
              <a href="mailto:support@skillswap.com" className="hover:text-white transition-colors">
                support@skillswap.com
              </a>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* X (Twitter) */}
              <a href="#" aria-label="X (Twitter)" className="flex items-center justify-center size-9 rounded-full bg-gray-800 hover:bg-indigo-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="flex items-center justify-center size-9 rounded-full bg-gray-800 hover:bg-indigo-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" aria-label="GitHub" className="flex items-center justify-center size-9 rounded-full bg-gray-800 hover:bg-indigo-600 text-white transition-colors">
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Middle: Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 pb-10">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-indigo-400 transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-indigo-400 transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Dashboards</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard/client" className="hover:text-indigo-400 transition-colors">Client Dashboard</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-indigo-400 transition-colors">Freelancer Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">How It Works</h3>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">1.</span> Post a Task with your budget</li>
              <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">2.</span> Receive Proposals from freelancers</li>
              <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">3.</span> Hire &amp; Pay securely via Stripe</li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-gray-700" />
            <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <span className="w-px h-3 bg-gray-700" />
            <Link href="mailto:support@skillswap.com" className="hover:text-gray-400 transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
