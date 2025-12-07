"use client";

import { use } from "react";
import Link from "next/link";
import {
  Calendar,
  FileText,
  Link as LinkIcon,
  Users,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogReviewModal from "@/components/reviews/LogReviewModal";
import StarRating from "@/components/common/StarRating";
import { format } from "date-fns";
import { api } from "@/lib/data";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const article = api.articles.get(id);
  const { data: reviews } = api.reviews.list({ query: { article_id: id } });

  if (!article) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-slate-500">Article not found</p>
      </div>
    );
  }

  const ratings = reviews?.map((r) => r.rating) || [];
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => ratings.filter((r) => Math.round(r) === star).length
  );
  const maxCount = Math.max(...ratingCounts, 1);

  const colors = [
    "from-blue-900 to-slate-900",
    "from-emerald-900 to-slate-900",
    "from-purple-900 to-slate-900",
    "from-indigo-900 to-slate-900",
    "from-rose-900 to-slate-900",
  ];
  const bgGradient = colors[article.title.length % colors.length];

  return (
    <div className="">
      {/* Backdrop Banner */}
      <div
        className={`absolute left-0 top-0 -z-10 h-64 w-full bg-gradient-to-b ${bgGradient} opacity-20 md:h-80`}
      ></div>

      <div className="mt-4 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-12 md:gap-12">
        {/* Left Column: Poster & Actions */}
        <div className="flex flex-col gap-6 md:col-span-3 lg:col-span-3">
          <div
            className={`group relative aspect-[3/4] overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-br ${bgGradient} flex flex-col justify-between p-6 shadow-2xl`}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 mt-auto">
              <h2 className="font-serif text-xl font-bold leading-tight text-white md:text-2xl">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{article.journal}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 font-serif text-2xl font-bold text-emerald-500">
              {avgRating > 0 ? avgRating.toFixed(1) : "-"}{" "}
              <StarRating rating={avgRating} />
            </div>

            <LogReviewModal article={article} />

            {article.doi && (
              <a
                href={
                  article.doi.startsWith("http")
                    ? article.doi
                    : `https://doi.org/${article.doi}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <LinkIcon className="h-4 w-4" /> Read Source
                </Button>
              </a>
            )}
          </div>

          {/* Rating Histogram */}
          <div className="rounded-lg border border-slate-800 bg-[#1b2228] p-4">
            <h4 className="mb-3 border-b border-slate-800 pb-2 text-xs font-bold uppercase text-slate-500">
              Ratings
            </h4>
            <div className="flex h-24 items-end gap-1">
              {ratingCounts.map((count, i) => (
                <div
                  key={i}
                  className="group relative flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-sm bg-slate-700 transition-colors hover:bg-emerald-500"
                    style={{ height: `${(count / maxCount) * 100}%` }}
                  ></div>
                  <span className="text-[10px] text-slate-500">{i + 1}</span>
                  {count > 0 && (
                    <div className="absolute -top-6 rounded bg-black px-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {count}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="space-y-10 md:col-span-9 lg:col-span-7">
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              {article.title}{" "}
              <span className="ml-2 font-sans text-2xl font-normal text-slate-500">
                {article.publication_year}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{article.authors?.join(", ")}</span>
              </div>
              {article.journal && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{article.journal}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Abstract
            </h3>
            <p className="font-serif text-lg leading-relaxed text-slate-300">
              {article.abstract || "No abstract available."}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-slate-800 pt-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Reviews{" "}
                <span className="text-emerald-500">{reviews?.length || 0}</span>
              </h3>
            </div>

            <div className="space-y-6">
              {reviews?.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-4 border-b border-slate-800/50 pb-6 last:border-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900 bg-emerald-900/50 font-bold text-emerald-500">
                    {review.created_by?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-300">
                        {review.created_by}
                      </span>
                      <span className="text-xs text-slate-600">Reviewing</span>
                      <span className="flex items-center gap-1 text-xs text-emerald-500">
                        <StarRating rating={review.rating} />
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {review.content}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-xs text-slate-600">
                        {format(new Date(review.created_date), "MMM d, yyyy")}
                      </span>
                      {review.liked && (
                        <span className="flex items-center gap-1 text-xs text-rose-500">
                          ♥ Liked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!reviews || reviews.length === 0) && (
                <div className="rounded-lg border border-dashed border-slate-800 bg-[#1b2228] p-8 text-center">
                  <Quote className="mx-auto mb-3 h-8 w-8 text-slate-700" />
                  <p className="mb-4 text-slate-500">
                    No reviews yet. Be the first to share your thoughts.
                  </p>
                  <LogReviewModal article={article} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
