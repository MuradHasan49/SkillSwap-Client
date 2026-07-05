import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, DollarSign, Star, Briefcase, Users, TrendingUp } from "lucide-react";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";
import HeroSlider from "@/components/shared/HeroSlider";
import Image from "next/image";

export const metadata = {
  title: "SkillSwap — Freelance Micro-Task Platform",
  description: "Post tasks, hire skilled freelancers, and get work done fast. SkillSwap is the simple marketplace for micro-tasks.",
};

const CATEGORIES = [
  { name: "Design", emoji: "🎨", href: "/tasks?category=Design" },
  { name: "Writing", emoji: "✍️", href: "/tasks?category=Writing" },
  { name: "Development", emoji: "💻", href: "/tasks?category=Development" },
  { name: "Marketing", emoji: "📣", href: "/tasks?category=Marketing" },
  { name: "Other", emoji: "⚡", href: "/tasks?category=Other" },
];

export default async function Home() {
  const db = await getDb();
  const user = await getUserSession();
  const isFreelancer = user?.role?.toLowerCase() === "freelancer";
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Featured Tasks — latest 6 open tasks
  const featuredTasks = await db
    .collection("tasks")
    .find({ status: "open" })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();

  // Top Freelancers — 6 freelancers
  const topFreelancers = await db
    .collection("user")
    .find({ role: "freelancer", isBlocked: { $ne: true } })
    .limit(6)
    .toArray();

  // Platform Statistics
  const totalTasks = await db.collection("tasks").countDocuments();
  const totalUsers = await db.collection("user").countDocuments();
  const payments = await db.collection("payments").find({ payment_status: "success" }).toArray();
  const totalPayout = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);

  return (
    <main className="overflow-x-hidden">

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-36 overflow-hidden bg-slate-900">
        <HeroSlider />

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-full text-indigo-200 text-sm font-semibold shadow-lg backdrop-blur-sm">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" /></span>
              {totalTasks} tasks posted and counting
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              Get your tasks done by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                skilled freelancers
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md font-medium">
              SkillSwap connects clients with talented freelancers for quick, affordable micro-tasks. Post a job, receive proposals, and get work done — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {user && !isFreelancer && !isAdmin && (
                <Link href="/dashboard/client/post-task">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300">
                    Post a Task
                  </Button>
                </Link>
              )}
              <Link href="/tasks">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-gray-400/50 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-300 shadow-xl">
                  Browse Tasks <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Platform Statistics ────────────────────────────── */}
      <section className="py-12 bg-indigo-600 dark:bg-indigo-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center text-white">
            <div className="space-y-1">
              <div className="text-4xl font-black">{totalTasks.toLocaleString()}</div>
              <div className="text-indigo-200 text-sm font-medium flex items-center justify-center gap-1"><Briefcase className="w-4 h-4" /> Tasks Posted</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black">{totalUsers.toLocaleString()}</div>
              <div className="text-indigo-200 text-sm font-medium flex items-center justify-center gap-1"><Users className="w-4 h-4" /> Members</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black">${totalPayout.toLocaleString()}</div>
              <div className="text-indigo-200 text-sm font-medium flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4" /> Paid Out</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Get things done in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Post a Task", desc: "Describe what you need done, set your budget and deadline." },
              { step: "2", title: "Get Proposals", desc: "Skilled freelancers review your task and send competitive bids." },
              { step: "3", title: "Hire & Pay Securely", desc: "Choose the best fit and pay safely through Stripe Checkout." },
            ].map((item) => (
              <div key={item.step} className="relative text-center space-y-4 p-8 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Categories ──────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-10">Popular Categories</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 transition-all font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span className="text-xl">{cat.emoji}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Tasks ──────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Latest Open Tasks</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Fresh opportunities for freelancers</p>
            </div>
            <Link href="/tasks">
              <Button variant="outline" className="flex items-center gap-2 shrink-0">
                View All Tasks <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {featuredTasks.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              No tasks posted yet. <Link href="/dashboard/client/post-task" className="text-indigo-600 font-semibold hover:underline">Be the first!</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTasks.map((task) => (
                <Link key={task._id.toString()} href={`/tasks/${task._id.toString()}`} className="group block">
                  <div className="h-full bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full">
                        {task.category}
                      </span>
                      <span className="flex items-center text-green-600 dark:text-green-400 font-bold text-sm">
                        <DollarSign className="w-3.5 h-3.5" />{task.budget}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-slate-700">
                      <span className="truncate max-w-[120px]">{task.client_email}</span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Top Freelancers ─────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Top Freelancers</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Talented professionals ready to help</p>
            </div>
            <Link href="/freelancers">
              <Button variant="outline" className="flex items-center gap-2 shrink-0">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {topFreelancers.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              No freelancers have joined yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topFreelancers.map((freelancer) => {
                const skills = freelancer.skills
                  ? (typeof freelancer.skills === "string" ? freelancer.skills.split(",").map(s => s.trim()).filter(Boolean) : freelancer.skills)
                  : [];
                return (
                  <Link key={freelancer._id.toString()} href={`/freelancers/${encodeURIComponent(freelancer.email)}`} className="group block">
                    <div className="h-full bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 shrink-0 overflow-hidden">
                          {freelancer.image ? (
                            <Image src={freelancer.image} alt={freelancer.name} width={56} height={56} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                          ) : (
                            (freelancer.name || "F").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {freelancer.name}
                          </h3>
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <Star className="w-3.5 h-3.5 fill-yellow-500" />
                            <span className="font-semibold text-gray-700 dark:text-gray-300">5.0</span>
                            <span className="text-gray-400 text-xs ml-1">Trusted</span>
                          </div>
                        </div>
                      </div>
                      {freelancer.bio && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{freelancer.bio}</p>
                      )}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full border border-indigo-100 dark:border-indigo-800/50">
                              {skill}
                            </span>
                          ))}
                          {skills.length > 4 && (
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 text-xs font-medium rounded-full">
                              +{skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      {freelancer.hourlyRate && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          ${freelancer.hourlyRate}/hr
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700">
        <div className="container mx-auto px-4 text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to get started?</h2>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">
            Join thousands of clients and freelancers on SkillSwap. Post your first task today — it's free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <Link href="/register">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-6 rounded-full shadow-xl hover:-translate-y-0.5 transition-all">
                  Create Free Account
                </Button>
              </Link>
            ) : !isFreelancer ? (
              <Link href="/dashboard/client/post-task">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-6 rounded-full shadow-xl hover:-translate-y-0.5 transition-all">
                  Post a Task
                </Button>
              </Link>
            ) : null}
            <Link href="/tasks">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-8 py-6 rounded-full hover:-translate-y-0.5 transition-all">
                Browse Tasks <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
