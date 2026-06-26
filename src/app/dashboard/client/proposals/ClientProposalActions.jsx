"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { acceptProposalAction, rejectProposalAction } from "@/app/actions/client";

export default function ClientProposalActions({ proposalId, taskId }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsAccepting(true);
    const res = await acceptProposalAction(proposalId, taskId);
    setIsAccepting(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Proposal accepted! Redirecting to payment...");
      // Redirect to payment checkout page
      router.push(`/payment/checkout?proposalId=${proposalId}&taskId=${taskId}`);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this proposal?")) return;
    setIsRejecting(true);
    const res = await rejectProposalAction(proposalId);
    setIsRejecting(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Proposal rejected.");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-[140px]">
      <Button
        onClick={handleAccept}
        disabled={isAccepting || isRejecting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
      >
        {isAccepting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
        Accept & Pay
      </Button>
      <Button
        onClick={handleReject}
        disabled={isAccepting || isRejecting}
        variant="outline"
        className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
        Reject
      </Button>
    </div>
  );
}
