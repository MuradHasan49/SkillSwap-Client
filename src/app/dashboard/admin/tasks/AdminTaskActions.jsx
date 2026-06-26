"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAnyTaskAction } from "@/app/actions/admin";

export default function AdminTaskActions({ taskId }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete this task? This action cannot be undone.`)) return;
    
    setIsLoading(true);
    const res = await deleteAnyTaskAction(taskId);
    setIsLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(`Task deleted successfully`);
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isLoading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
