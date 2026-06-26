"use server";

import { createProposal } from "@/lib/core/proposals";
import { requireRole } from "@/lib/core/session";
import { revalidatePath } from "next/cache";

export async function submitProposalAction(formData) {
  try {
    const user = await requireRole("freelancer");
    
    const taskId = formData.get("taskId");
    const budget = parseFloat(formData.get("budget"));
    const days = parseInt(formData.get("days"), 10);
    const coverNote = formData.get("coverNote");
    
    if (!taskId || !budget || !days || !coverNote) {
      return { error: "All fields are required" };
    }
    
    await createProposal({
      task_id: taskId,
      freelancer_email: user.email,
      proposed_budget: budget,
      estimated_days: days,
      cover_note: coverNote
    });
    
    revalidatePath(`/tasks/${taskId}`);
    revalidatePath("/dashboard/freelancer/proposals");
    
    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to submit proposal" };
  }
}
