"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { submitDeliverableAction } from "@/app/actions/freelancer";

export default function ActiveProjectActions({ taskId, status, deliverableUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url) return toast.error("Please enter a valid URL");
    
    setIsLoading(true);
    const res = await submitDeliverableAction(taskId, url);
    setIsLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Deliverable submitted successfully!");
      setIsOpen(false);
    }
  }

  if (status === "completed") {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
        <CheckCircle className="w-5 h-5" />
        Deliverable Submitted
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
        <UploadCloud className="w-4 h-4 mr-2" />
        Submit Deliverable
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="url"
        required
        placeholder="https://docs.google.com/... or GitHub link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800"
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </div>
    </form>
  );
}
