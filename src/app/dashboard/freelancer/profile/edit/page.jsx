import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import EditProfileForm from "../EditProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Edit Profile - SkillSwap" };

export default async function EditFreelancerProfilePage() {
  const user = await requireRole("freelancer");
  const db = await getDb();
  
  const userData = await db.collection("user").findOne({ email: user.email });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard/freelancer/profile" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors" aria-label="Go back to profile page">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile
      </Link>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
        <p className="text-gray-500 dark:text-gray-400">Update your public profile details and skills.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
        <EditProfileForm 
          initialData={{
            name: userData?.name || "",
            image: userData?.image || "",
            skills: userData?.skills || "",
            bio: userData?.bio || "",
            hourlyRate: userData?.hourlyRate || ""
          }} 
        />
      </div>
    </div>
  );
}
