"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  FileText,
  Link as LinkIcon,
  Users,
  Quote,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogReviewModal from "@/components/reviews/LogReviewModal";
import StarRating from "@/components/common/StarRating";
import type { JstorArticle } from "@/lib/types/api";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<JstorArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/.netlify/functions/article?id=${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Article not found");
          } else {
            throw new Error("Failed to fetch");
          }
          return;
        }
        const data = await res.json();
        setArticle(data.data);
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-slate-500">{error || "Article not found"}</p>
      </div>
    );
  }

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
              <p className="mt-2 text-sm text-slate-300">
                {article.creators_string}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <LogReviewModal article={article} />

            {article.url && (
              <a
                href={
                  article.url.startsWith("http")
                    ? article.url
                    : `https://${article.url}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <LinkIcon className="h-4 w-4" /> Read on JSTOR
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-10 md:col-span-9 lg:col-span-7">
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              {article.title}{" "}
              <span className="ml-2 font-sans text-2xl font-normal text-slate-500">
                {article.published_date}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{article.creators_string}</span>
              </div>
            </div>
          </div>

          {/* Reviews Section - placeholder for now */}
          <div className="border-t border-slate-800 pt-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Reviews
              </h3>
            </div>

            <div className="rounded-lg border border-dashed border-slate-800 bg-[#1b2228] p-8 text-center">
              <Quote className="mx-auto mb-3 h-8 w-8 text-slate-700" />
              <p className="mb-4 text-slate-500">
                No reviews yet. Be the first to share your thoughts.
              </p>
              <LogReviewModal article={article} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
