"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { toggleUserBlockAction } from "@/app/actions/admin";

export default function AdminUserActions({ email, isBlocked }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    if (!confirm(`Are you sure you want to ${isBlocked ? "unblock" : "block"} this user?`)) return;
    
    setIsLoading(true);
    const res = await toggleUserBlockAction(email, isBlocked);
    setIsLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggle} 
      disabled={isLoading}
      className={isBlocked ? "text-green-600 border-green-200 hover:bg-green-50" : "text-red-600 border-red-200 hover:bg-red-50"}
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isBlocked ? <CheckCircle className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
      {isBlocked ? "Unblock" : "Block"}
    </Button>
  );
}
