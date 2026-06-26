import { ThemeProvider } from "@/components/theme-provider";
import { Kanit, Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "SkillSwap - Freelance Micro-Task Platform",
  description: "SkillSwap is a marketplace where clients post small tasks and freelancers get hired to complete them quickly and efficiently.",
};

import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ubuntu.variable} ${kanit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="#4f46e5" showSpinner={false} height={3} shadow="0 0 10px #4f46e5,0 0 5px #4f46e5" />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
