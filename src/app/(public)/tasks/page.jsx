import { getTasks } from "@/lib/core/tasks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Filter, CalendarDays, DollarSign, ArrowRight, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Browse Tasks - SkillSwap",
  description: "Find the perfect freelance micro-task for your skills.",
};

export default async function BrowseTasksPage({ searchParams }) {
  const qParams = await searchParams;
  const page = parseInt(qParams.page || "1", 10);
  const search = qParams.search || "";
  const category = qParams.category || "";

  const query = { status: "open" };
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  if (category && category !== "All") {
    query.category = category;
  }

  const { tasks, total, totalPages } = await getTasks(query, page, 9);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Tasks</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Find open tasks and submit your proposals.</p>
          </div>
          
          {/* Search & Filter Form - handled by native form submission which updates URL params */}
          <form method="GET" action="/tasks" className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="category"
                defaultValue={category || "All"}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white appearance-none"
              >
                <option value="All">All Categories</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Filter
            </Button>
          </form>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filters.</p>
            {(search || category) && (
              <Link href="/tasks">
                <Button variant="outline" className="mt-4">Clear Filters</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                      {task.category}
                    </span>
                    <span className="flex items-center text-green-600 dark:text-green-400 font-bold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {task.budget}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {task.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                    {task.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Link href={`/tasks/${task._id}`}>
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                {page > 1 ? (
                  <Link href={`/tasks?page=${page - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </Button>
                )}
                
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link href={`/tasks?page=${page + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
