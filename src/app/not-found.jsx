import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center bg-background p-6 py-12 md:py-24">

        <div className="max-w-3xl w-full text-center space-y-8 flex flex-col items-center">

          {/* Illustration */}
          <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <Compass className="w-24 h-24 md:w-32 md:h-32 text-indigo-500 animate-[spin_4s_ease-in-out_infinite]" />
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-black text-indigo-600 tracking-tighter">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Looks like you took a wrong turn.
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We couldn't find the page you're looking for. Let's get you back to finding top freelancers and great projects.
            </p>
          </div>

          {/* Action */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 px-8 text-lg font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30 hover:-translate-y-1">
              <Link href="/">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl h-14 px-8 text-lg font-semibold transition-all hover:-translate-y-1">
              <Link href="/tasks">
                Browse Tasks
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
