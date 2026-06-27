"use server";

import { requireRole } from "@/lib/core/session";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function toggleUserBlockAction(email, isBlocked) {
  try {
    await requireRole("admin");
    const db = await getDb();
    
    const nextStatus = !isBlocked;

    await db.collection("user").updateOne(
      { email },
      { $set: { isBlocked: nextStatus, banned: nextStatus, banReason: nextStatus ? "Blocked by admin" : null } }
    );

    // If we are blocking the user, we should also delete their active sessions
    if (nextStatus) {
      const targetUser = await db.collection("user").findOne({ email });
      if (targetUser) {
        await db.collection("session").deleteMany({ userId: targetUser._id.toString() });
      }
    }

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to toggle block status" };
  }
}

export async function deleteAnyTaskAction(taskId) {
  try {
    await requireRole("admin");
    const db = await getDb();
    
    await db.collection("tasks").deleteOne({ _id: new ObjectId(taskId) });
    // Cleanup associated proposals
    await db.collection("proposals").deleteMany({ task_id: taskId });

    revalidatePath("/dashboard/admin/tasks");
    revalidatePath("/tasks");
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to delete task" };
  }
}
