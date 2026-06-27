import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import { getFreelancerReviews } from "@/lib/core/reviews";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit2, MapPin, Briefcase, Star, Mail } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "My Profile - SkillSwap" };

export default async function FreelancerProfileViewPage() {
  const user = await requireRole("freelancer");
  const db = await getDb();
  
  const userData = await db.collection("user").findOne({ email: user.email });

  if (!userData) {
    return <div>Profile not found.</div>;
  }

  const reviews = await getFreelancerReviews(user.email);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
          <p className="text-gray-500 dark:text-gray-400">View how clients see your profile.</p>
        </div>
        <Link href="/dashboard/freelancer/profile/edit">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
        
        <div className="px-6 md:px-10 pb-10 relative">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 overflow-hidden shadow-lg flex-shrink-0">
              {userData.image ? (
                <Image src={userData.image} alt={userData.name} width={128} height={128} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gray-100 dark:bg-slate-800">
                  {userData.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                {averageRating ? (
                  <span className="flex items-center text-yellow-500 font-semibold">
                    <Star className="w-4 h-4 fill-current mr-1" /> {averageRating} Rating ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}) - Profile Preview
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-500 font-semibold">
                    <Star className="w-4 h-4 fill-current mr-1" /> Profile Preview
                  </span>
                )}
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" /> {userData.email}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" /> {reviews.length} Jobs Completed
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">About Me</h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p className="whitespace-pre-line">{userData.bio || "You haven't written a bio yet."}</p>
                </div>
              </div>

              <div className="pt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-700 pb-2">Client Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-200 dark:text-gray-700"}`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {review.testimonial && (
                          <p className="text-gray-700 dark:text-gray-300 italic">"{review.testimonial}"</p>
                        )}
                        <div className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                          - {review.client_email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                {userData.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.split(",").map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills listed.</p>
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hourly Rate</h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {userData.hourlyRate ? `$${userData.hourlyRate}/hr` : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
