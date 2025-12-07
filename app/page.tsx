"use client";

import Link from "next/link";
import { TrendingUp, Activity } from "lucide-react";
import ArticleCard from "@/components/common/ArticleCard";
import StarRating from "@/components/common/StarRating";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { api } from "@/lib/data";

export default function Home() {
  const { data: articles } = api.articles.list({ limit: 12 });
  const { data: reviews } = api.reviews.list();

  const getReviewArticle = (review: (typeof reviews)[0]) =>
    articles?.find((a) => a.id === review.article_id);

  return (
    <div className="space-y-12">
      {/* Hero / Welcome */}
      <section className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-emerald-900/20 bg-gradient-to-b from-emerald-900/10 to-transparent py-12 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-6xl">
          Track the <span className="text-emerald-500">knowledge</span> you
          consume.
        </h1>
        <p className="max-w-2xl text-lg text-slate-400">
          Social networking for academics. Keep a diary of the papers you read,
          rate them, review them, and discover new research.
        </p>
        <Link href="/articles">
          <button className="mt-4 transform rounded-full bg-emerald-600 px-8 py-3 font-medium text-white shadow-lg shadow-emerald-900/50 transition-all hover:scale-105 hover:bg-emerald-500">
            Start Browsing
          </button>
        </Link>
      </section>

      {/* Popular / Recent Articles Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
            <TrendingUp className="h-4 w-4 text-emerald-500" /> Popular This
            Week
          </h2>
          <Link
            href="/articles"
            className="text-xs font-bold uppercase text-slate-500 transition-colors hover:text-white"
          >
            More
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6">
          {articles?.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} reviews={reviews} />
          ))}
        </div>
      </section>

      {/* Recent Reviews Feed */}
      <div className="lg:col-span-2">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
            <Activity className="h-4 w-4 text-emerald-500" /> Just Reviewed
          </h2>
        </div>

        <div className="space-y-6">
          {reviews?.map((review) => {
            const article = getReviewArticle(review);
            if (!article) return null;

            return (
              <div
                key={review.id}
                className="flex gap-4 rounded-xl border border-slate-800 bg-[#1b2228] p-4 transition-colors hover:border-slate-700"
              >
                <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-slate-800">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-900/50 to-slate-900 p-1">
                    <span className="text-center text-[8px] leading-tight text-slate-400">
                      {article.title.slice(0, 20)}...
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/articles/${article.id}`}
                        className="font-serif text-lg font-bold text-slate-200 hover:text-emerald-400"
                      >
                        {article.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {article.publication_year}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <StarRating rating={review.rating} />
                      <span className="mt-1 text-xs text-slate-600">
                        {format(new Date(review.created_date), "MMM d")}
                      </span>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-sm font-light leading-relaxed text-slate-400">
                    {review.content}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-500">
                      {review.created_by?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-xs text-slate-500">
                      Reviewed by{" "}
                      <span className="text-slate-400">
                        {review.created_by}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {(!reviews || reviews.length === 0) && (
            <div className="text-sm italic text-slate-500">
              No reviews yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
