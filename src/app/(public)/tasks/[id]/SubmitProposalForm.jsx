"use client";

import { useState } from "react";
import { submitProposalAction } from "@/app/actions/proposals";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SubmitProposalForm({ taskId, freelancerEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    formData.append("taskId", taskId);
    
    const res = await submitProposalAction(formData);
    
    setIsLoading(false);
    if (res?.error) {
      toast.error(res.error);
    } else if (res?.success) {
      toast.success("Proposal submitted successfully!");
      setIsSubmitted(true);
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-xl border border-green-200 dark:border-green-800/30 text-center font-medium">
        Your proposal has been successfully submitted! The client will review it soon.
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proposed Budget ($)</label>
          <input
            type="number"
            name="budget"
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800"
            placeholder="e.g. 150"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Days</label>
          <input
            type="number"
            name="days"
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800"
            placeholder="e.g. 3"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Note</label>
        <textarea
          name="coverNote"
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 resize-none"
          placeholder="Why are you the best fit for this task?"
        ></textarea>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Submit Application
      </Button>
    </form>
  );
}
