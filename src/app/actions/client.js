"use server";

import { createTask, updateTaskStatus, deleteTask } from "@/lib/core/tasks";
import { requireRole } from "@/lib/core/session";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function postTaskAction(formData) {
  try {
    const user = await requireRole("client");
    
    const title = formData.get("title");
    const category = formData.get("category");
    const budget = parseFloat(formData.get("budget"));
    const deadline = formData.get("deadline");
    const description = formData.get("description");
    
    if (!title || !category || !budget || !deadline || !description) {
      return { error: "All fields are required" };
    }
    
    await createTask({
      title,
      category,
      budget,
      deadline,
      description,
      client_email: user.email
    });
    
    revalidatePath("/dashboard/client");
    revalidatePath("/dashboard/client/tasks");
    revalidatePath("/tasks");
    
    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to post task" };
  }
}

export async function editTaskAction(formData) {
  try {
    const user = await requireRole("client");
    const taskId = formData.get("taskId");
    const title = formData.get("title");
    const category = formData.get("category");
    const budget = parseFloat(formData.get("budget"));
    const deadline = formData.get("deadline");
    const description = formData.get("description");

    const db = await getDb();
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(taskId), client_email: user.email });
    if (!task) return { error: "Task not found or unauthorized" };
    if (task.status !== "open") return { error: "Can only edit open tasks" };

    await db.collection("tasks").updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { title, category, budget, deadline, description } }
    );

    revalidatePath("/dashboard/client/tasks");
    revalidatePath(`/tasks/${taskId}`);
    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to edit task" };
  }
}

export async function deleteTaskAction(taskId) {
  try {
    const user = await requireRole("client");
    await deleteTask(taskId, user.email);
    
    revalidatePath("/dashboard/client/tasks");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to delete task" };
  }
}

export async function markTaskCompletedAction(taskId) {
    try {
        const user = await requireRole("client");
        const db = await getDb();
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(taskId), client_email: user.email });
        if (!task) return { error: "Task not found" };

        await updateTaskStatus(taskId, "completed");
        revalidatePath("/dashboard/client/tasks");
        return { success: true };
    } catch (e) {
        return { error: e.message || "Failed to complete task" };
    }
}

export async function acceptProposalAction(proposalId, taskId) {
  try {
    const user = await requireRole("client");
    const db = await getDb();
    
    // Check task ownership
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(taskId), client_email: user.email });
    if (!task) return { error: "Task not found" };
    if (task.status !== "open") return { error: "Task is no longer open" };

    // Update proposal to accepted
    await db.collection("proposals").updateOne(
      { _id: new ObjectId(proposalId) },
      { $set: { status: "accepted" } }
    );
    
    // Reject others
    await db.collection("proposals").updateMany(
      { task_id: taskId, _id: { $ne: new ObjectId(proposalId) } },
      { $set: { status: "rejected" } }
    );

    revalidatePath("/dashboard/client/proposals");
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to accept proposal" };
  }
}

export async function rejectProposalAction(proposalId) {
  try {
    const user = await requireRole("client");
    const db = await getDb();
    
    // Check ownership through task
    const proposal = await db.collection("proposals").findOne({ _id: new ObjectId(proposalId) });
    if (!proposal) return { error: "Proposal not found" };
    
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(proposal.task_id), client_email: user.email });
    if (!task) return { error: "Unauthorized" };

    await db.collection("proposals").updateOne(
      { _id: new ObjectId(proposalId) },
      { $set: { status: "rejected" } }
    );

    revalidatePath("/dashboard/client/proposals");
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to reject proposal" };
  }
}
