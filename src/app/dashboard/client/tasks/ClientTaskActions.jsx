"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, CheckCircle, ExternalLink, Loader2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { deleteTaskAction, markTaskCompletedAction, submitReviewAction } from "@/app/actions/client";
import { useRouter } from "next/navigation";

export default function ClientTaskActions({ task }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [testimonial, setTestimonial] = useState("");
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
      
      {task.status === "completed" && (
        <>
          {task.deliverable_url && (
            <a href={task.deliverable_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">View Deliverable</Button>
            </a>
          )}
          {!task.hasReviewed && (
            <Button variant="outline" size="sm" onClick={() => setIsReviewModalOpen(true)} className="text-amber-600 border-amber-200 hover:bg-amber-50">
              <Star className="w-4 h-4 mr-1 fill-current" /> Rate Freelancer
            </Button>
          )}
        </>
      )}

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate Freelancer</DialogTitle>
            <DialogDescription>
              Share your experience working with this freelancer. Your review will be visible on their profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Star Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Testimonial</label>
              <Textarea
                placeholder="Write a brief review about their work..."
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700" 
              onClick={async () => {
                setIsSubmittingReview(true);
                const formData = new FormData();
                formData.append("taskId", task._id);
                formData.append("rating", rating);
                formData.append("testimonial", testimonial);
                const res = await submitReviewAction(formData);
                setIsSubmittingReview(false);
                if (res?.error) {
                  toast.error(res.error);
                } else {
                  toast.success("Review submitted successfully");
                  setIsReviewModalOpen(false);
                }
              }} 
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
