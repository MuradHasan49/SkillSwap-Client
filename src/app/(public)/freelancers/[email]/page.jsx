import { getFreelancerByEmail } from "@/lib/core/users";
import { getFreelancerReviews } from "@/lib/core/reviews";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export async function generateMetadata({ params }) {
  const p = await params;
  const email = decodeURIComponent(p.email);
  const user = await getFreelancerByEmail(email);
  if (!user) return { title: "Profile Not Found" };
  return { title: `${user.name} - Freelancer Profile` };
}

export default async function FreelancerProfilePage({ params }) {
  const p = await params;
  const email = decodeURIComponent(p.email);
  const freelancer = await getFreelancerByEmail(email);

  if (!freelancer) {
    notFound();
  }

  const reviews = await getFreelancerReviews(email);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/freelancers" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to freelancers
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700">
          {/* Header/Cover Profile */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
          
          <div className="px-6 md:px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 md:-mt-20 mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 overflow-hidden shadow-lg flex-shrink-0">
                {freelancer.image ? (
                  <Image src={freelancer.image} alt={freelancer.name} width={160} height={160} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gray-100 dark:bg-slate-800">
                    {freelancer.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {freelancer.name}
                  <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {averageRating ? (
                    <span className="flex items-center text-yellow-500 font-semibold">
                      <Star className="w-4 h-4 fill-current mr-1" /> {averageRating} Rating ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500 font-semibold">
                      No ratings yet
                    </span>
                  )}
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" /> {reviews.length} Jobs Completed
                  </span>
                </div>
              </div>
              
              <div className="pb-2">
                <Link href={`mailto:${freelancer.email}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                    <Mail className="w-4 h-4 mr-2" /> Contact Me
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">About Me</h2>
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p className="whitespace-pre-line">{freelancer.bio || "This freelancer hasn't written a bio yet."}</p>
                  </div>
                </div>

                {/* Testimonials Section */}
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
                  {freelancer.skills ? (
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.split(",").map((skill, idx) => (
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
                    {freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : "Negotiable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
