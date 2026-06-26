"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/freelancer";

export default function EditProfileForm({ initialData }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    const res = await updateProfileAction(formData);
    setIsLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile updated successfully!");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          defaultValue={initialData.name}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture URL</label>
        <input
          type="url"
          name="image"
          defaultValue={initialData.image}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          defaultValue={initialData.skills}
          placeholder="e.g. React, Node.js, UI/UX Design"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hourly Rate ($)</label>
        <input
          type="number"
          name="hourlyRate"
          defaultValue={initialData.hourlyRate}
          min="1"
          placeholder="e.g. 35"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
        <textarea
          name="bio"
          defaultValue={initialData.bio}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all resize-none"
          placeholder="Tell clients about your experience and expertise..."
        ></textarea>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        Save Changes
      </Button>
    </form>
  );
}
