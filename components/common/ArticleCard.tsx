"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import type { JstorArticle } from "@/lib/types/api";

interface ArticleCardProps {
  article: JstorArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const colors = [
    "from-blue-900 to-slate-900",
    "from-emerald-900 to-slate-900",
    "from-purple-900 to-slate-900",
    "from-indigo-900 to-slate-900",
    "from-rose-900 to-slate-900",
  ];
  const colorIndex = article.title.length % colors.length;
  const bgGradient = colors[colorIndex];
  const avgRating = 3; // Placeholder for average rating

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
            <h3 className="line-clamp-5 font-serif font-bold leading-tight text-white">
              {article.title}
            </h3>
          </div>

          <div className="relative z-10">
            <p className="line-clamp-1 text-xs font-medium text-slate-300">
              {article.creators_string}
            </p>
            <p className="text-xs text-slate-500">{article.published_date}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            {avgRating > 0 && (
              <>
                <StarRating rating={avgRating} />
                <span>({avgRating.toFixed(1)})</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
