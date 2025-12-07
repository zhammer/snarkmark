"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import type { JstorArticle } from "@/lib/types/api";

interface ArticleCardProps {
  article: JstorArticle;
  reviewedBy?: string;
  rating?: number | null;
  reviewNote?: string | null;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace("book_part", "chapter")
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ArticleCard({ article, reviewedBy, rating, reviewNote }: ArticleCardProps) {
  const colors = [
    "from-blue-900 to-slate-900",
    "from-emerald-900 to-slate-900",
    "from-purple-900 to-slate-900",
    "from-indigo-900 to-slate-900",
    "from-rose-900 to-slate-900",
  ];
  const colorIndex = article.title.length % colors.length;
  const bgGradient = colors[colorIndex];
  const displayRating = rating ?? article.avg_rating ?? null;

  return (
    <Link href={`/articles/${article.item_id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative flex w-full flex-col gap-2"
      >
        <div
          className={`aspect-[3/4] overflow-hidden rounded-md border border-slate-700 bg-gradient-to-br ${bgGradient} relative flex flex-col justify-between p-4 shadow-lg transition-all group-hover:border-emerald-500/50 group-hover:shadow-emerald-900/20`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          <div className="relative z-10">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {toTitleCase(article.content_type)}
            </p>
            <h3 className="line-clamp-4 font-serif font-bold leading-tight text-white">
              {article.title}
            </h3>
          </div>

          <div className="relative z-10">
            <p className="line-clamp-1 text-xs font-medium text-slate-300">
              {article.creators_string}
            </p>
            <p className="text-xs text-slate-500">
              {article.published_date?.slice(0, 4)}
            </p>
          </div>
        </div>

        <div className="px-1">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <StarRating rating={displayRating ?? 0} />
            <span>({displayRating ? displayRating.toFixed(1) : "0"})</span>
          </div>
          {reviewedBy && (
            <p className="mt-1 truncate text-xs text-slate-500">by {reviewedBy}</p>
          )}
          {reviewNote && (
            <p className="mt-1 line-clamp-2 text-xs italic text-slate-400">
              &ldquo;{reviewNote}&rdquo;
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
