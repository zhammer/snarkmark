"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Heart, PenTool } from "lucide-react";
import { api, Article } from "@/lib/data";

interface LogReviewModalProps {
  article: Article;
  trigger?: React.ReactNode;
}

export default function LogReviewModal({
  article,
  trigger,
}: LogReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      console.log("[UI] Please add a rating");
      alert("Please add a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = api.auth.me();
      console.log("[UI] User:", user);

      const review = api.reviews.create({
        article_id: article.id,
        rating,
        content,
        liked,
      });
      console.log("[UI] Review created:", review);
      alert("Review logged! (Check console for details)");
      setIsOpen(false);
      setRating(0);
      setContent("");
      setLiked(false);
    } catch (error) {
      console.error("[UI] Error:", error);
      alert("Failed to log review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
            <PenTool className="h-4 w-4" /> Mark
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-slate-700 bg-[#1b2228] text-slate-200 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1">
            <span className="text-sm font-normal uppercase tracking-wider text-slate-400">
              I read...
            </span>
            <span className="font-serif text-2xl font-bold">
              {article.title}
            </span>
            <span className="text-sm font-normal text-slate-400">
              {article.publication_year}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rating
            </label>
            <div className="flex items-center gap-2">
              <div
                className="flex gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110 focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating || rating) >= star
                          ? "fill-emerald-500 text-emerald-500"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`ml-auto rounded-full p-2 transition-colors ${
                  liked
                    ? "bg-rose-500/20 text-rose-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Heart className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Review
            </label>
            <Textarea
              placeholder="Add a review..."
              className="min-h-[150px] resize-none border-slate-700 bg-[#14181c] text-slate-200 focus-visible:ring-emerald-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
