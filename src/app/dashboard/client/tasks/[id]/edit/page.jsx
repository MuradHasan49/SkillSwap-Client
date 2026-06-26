import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/core/session";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import EditTaskForm from "./EditTaskForm";

export const metadata = { title: "Edit Task - SkillSwap" };

export default async function EditTaskPage({ params }) {
  const { id } = await params;
  const user = await requireRole("client");
  const db = await getDb();
  
  const task = await db.collection("tasks").findOne({ 
    _id: new ObjectId(id),
    client_email: user.email
  });

  if (!task) {
    redirect("/dashboard/client/tasks");
  }

  // Convert ObjectId to string for client component
  const serializedTask = JSON.parse(JSON.stringify(task));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h2>
        <p className="text-gray-500 dark:text-gray-400">Update the details of your posted task.</p>
      </div>
      <EditTaskForm task={serializedTask} />
    </div>
  );
}
