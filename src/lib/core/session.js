import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

import { getTokenServer } from "../getTokenServer";

export const getUserToken = async () => {
  const token = await getTokenServer();
  return token || null;
};

export const requireRole = async (role) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  if (user.isBlocked || user.banned) {
    redirect("/login?error=blocked");
  }

  let userRole = (user?.role || user?.initialRole || "client").toLowerCase();
  if (userRole === "user") userRole = "client";

  if (userRole !== role) {
    // Redirect to user's own dashboard instead of a 404 /unauthorized
    if (userRole === "admin" || userRole === "freelancer" || userRole === "client") {
      redirect(`/dashboard/${userRole}`);
    } else {
      redirect("/login");
    }
  }

  return user;
};
