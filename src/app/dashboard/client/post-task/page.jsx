"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { postTaskAction } from "@/app/actions/client";

export default function PostTaskPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData) {
    setIsLoading(true);
    const res = await postTaskAction(formData);
    setIsLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Task posted successfully!");
      router.push("/dashboard/client/tasks");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Task</h2>
        <p className="text-gray-500 dark:text-gray-400">Describe what you need done and receive proposals from talented freelancers.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
              placeholder="e.g. Design a new logo for my bakery"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all appearance-none"
            >
              <option value="">Select a category</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget (USD)</label>
              <input
                type="number"
                name="budget"
                required
                min="5"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detailed Description</label>
            <textarea
              name="description"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all resize-none"
              placeholder="Provide all necessary details, requirements, and examples..."
            ></textarea>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Publish Task
          </Button>
        </form>
      </div>
    </div>
  );
}
