import { getFreelancers } from "@/lib/core/users";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase, ChevronRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Browse Freelancers - SkillSwap",
  description: "Find the best freelancers for your tasks.",
};

export default async function BrowseFreelancersPage() {
  const freelancers = await getFreelancers();

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Top Freelancers</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our directory of skilled professionals ready to take on your tasks.
          </p>
        </div>

        {freelancers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No freelancers found.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <div key={freelancer._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700 flex-shrink-0">
                    {freelancer.image ? (
                      <Image src={freelancer.image} alt={freelancer.name} width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                        {freelancer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{freelancer.name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm font-medium mt-1">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      4.9 {/* Hardcoded for now, would be calculated from reviews */}
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                    {freelancer.bio || "No bio provided."}
                  </p>
                  
                  {freelancer.skills && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {freelancer.skills.split(",").slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                          {skill.trim()}
                        </span>
                      ))}
                      {freelancer.skills.split(",").length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                          +{freelancer.skills.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : "Rate N/A"}
                  </div>
                  <Link href={`/freelancers/${encodeURIComponent(freelancer.email)}`}>
                    <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-semibold p-0 h-auto">
                      View Profile <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
