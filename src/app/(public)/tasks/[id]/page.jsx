import { getTaskById } from "@/lib/core/tasks";
import { getUserSession } from "@/lib/core/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, Tag, User, ArrowLeft, Send } from "lucide-react";
import SubmitProposalForm from "./SubmitProposalForm";

export async function generateMetadata({ params }) {
  const p = await params;
  const task = await getTaskById(p.id);
  if (!task) return { title: "Task Not Found" };
  return { title: `${task.title} - SkillSwap` };
}

export default async function TaskDetailsPage({ params }) {
  const p = await params;
  const task = await getTaskById(p.id);
  const user = await getUserSession();
  
  if (!task) {
    notFound();
  }

  const role = (user?.role || user?.initialRole || "user").toLowerCase();
  const isFreelancer = role === "freelancer";
  const isClient = role === "client";
  const isTaskOwner = isClient && user?.email === task.client_email;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/tasks" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to tasks
        </Link>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-semibold rounded-full">
                  <Tag className="w-4 h-4 mr-1" /> {task.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                  task.status === "open" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  task.status === "in-progress" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}>
                  {task.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {task.title}
              </h1>
              
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p className="whitespace-pre-line">{task.description}</p>
              </div>
            </div>

            {isFreelancer && task.status === "open" && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Send className="w-5 h-5 mr-2 text-indigo-600" /> Submit a Proposal
                </h2>
                <SubmitProposalForm taskId={task._id} freelancerEmail={user.email} />
              </div>
            )}
            
            {isTaskOwner && (
               <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30 text-center">
                 <p className="text-indigo-800 dark:text-indigo-300 font-medium">You are the owner of this task.</p>
                 <Link href="/dashboard/client/proposals">
                    <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">View Proposals in Dashboard</Button>
                 </Link>
               </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">Task Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" /> Budget
                  </span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">${task.budget}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2" /> Deadline
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <User className="w-5 h-5 mr-2" /> Client
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                    {task.client_email}
                  </span>
                </div>
              </div>
              
              {!user && task.status === "open" && (
                <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <Link href="/login">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Log in to Apply</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
