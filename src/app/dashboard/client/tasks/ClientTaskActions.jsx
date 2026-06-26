"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteTaskAction, markTaskCompletedAction } from "@/app/actions/client";
import { useRouter } from "next/navigation";

export default function ClientTaskActions({ task }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    const res = await deleteTaskAction(task._id);
    setIsDeleting(false);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Task deleted successfully");
    }
  }

  async function handleComplete() {
    if (!confirm("Mark this task as completed? This action cannot be undone.")) return;
    setIsCompleting(true);
    const res = await markTaskCompletedAction(task._id);
    setIsCompleting(false);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Task marked as completed");
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/tasks/${task._id}`}>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" title="View Public Page">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </Link>
      
      {task.status === "open" && (
        <>
          <Link href={`/dashboard/client/tasks/${task._id}/edit`}>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50" title="Edit">
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} className="text-gray-500 hover:text-red-600 hover:bg-red-50" title="Delete">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </>
      )}

      {task.status === "in-progress" && (
        <Button variant="ghost" size="icon" onClick={handleComplete} disabled={isCompleting} className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Mark Completed">
          {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        </Button>
      )}
      
      {task.status === "completed" && task.deliverable_url && (
         <a href={task.deliverable_url} target="_blank" rel="noopener noreferrer">
           <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">View Deliverable</Button>
         </a>
      )}
    </div>
  );
}
