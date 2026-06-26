import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";

export default async function DashboardRedirectPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  let role = (user?.role || user?.initialRole || "client").toLowerCase();
  if (role === "user") role = "client";

  redirect(`/dashboard/${role}`);
}
