"use server";

import { requireRole } from "@/lib/core/session";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function submitDeliverableAction(taskId, deliverableUrl) {
  try {
    const user = await requireRole("freelancer");
    const db = await getDb();
    
    // Ensure freelancer has an accepted proposal for this task
    const proposal = await db.collection("proposals").findOne({
      task_id: taskId,
      freelancer_email: user.email,
      status: "accepted"
    });
    
    if (!proposal) return { error: "Unauthorized or proposal not accepted." };
    
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(taskId) });
    if (!task) return { error: "Task not found." };
    if (task.status !== "in-progress") return { error: "Task is not in progress." };

    await db.collection("tasks").updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { status: "completed", deliverable_url: deliverableUrl } }
    );

    revalidatePath("/dashboard/freelancer/active-projects");
    revalidatePath(`/tasks/${taskId}`);
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to submit deliverable" };
  }
}

export async function updateProfileAction(formData) {
  try {
    const user = await requireRole("freelancer");
    const db = await getDb();
    
    const name = formData.get("name");
    const bio = formData.get("bio");
    const skills = formData.get("skills");
    const image = formData.get("image");
    const hourlyRate = parseFloat(formData.get("hourlyRate")) || 0;
    
    await db.collection("user").updateOne(
      { email: user.email },
      { $set: { name, bio, skills, image, hourlyRate } }
    );
    
    revalidatePath("/dashboard/freelancer/profile");
    revalidatePath(`/freelancers/${encodeURIComponent(user.email)}`);
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to update profile" };
  }
}
