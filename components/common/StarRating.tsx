"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "lg";
}

export default function StarRating({
  rating,
  max = 5,
  size = "sm",
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => {
        const isFull = i < fullStars;
        const isHalf = !isFull && i === fullStars && hasHalfStar;

        if (isHalf) {
          return (
            <div key={i} className="relative">
              <Star className="h-4 w-4 text-slate-600" />
              <div className="absolute left-0 top-0 w-[50%] overflow-hidden">
                <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              </div>
            </div>
          );
        }

        return (
          <Star
            key={i}
            className={`${size === "lg" ? "h-6 w-6" : "h-4 w-4"} ${
              isFull ? "fill-emerald-500 text-emerald-500" : "text-slate-600"
            }`}
          />
        );
      })}
    </div>
  );
}
