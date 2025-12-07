"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import StarRating from "@/components/common/StarRating";
import { api, User, Review, Article } from "@/lib/data";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const u = api.auth.me();
        setUser(u);
      } catch (e) {
        console.log("[UI] Auth error:", e);
        api.auth.redirectToLogin();
      }
    };
    fetchUser();
  }, []);

  const { data: allArticles } = api.articles.list();
  const { data: allReviews } = api.reviews.list();

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const myReviews =
    allReviews?.filter((r) => r.created_by === user.email) || [];
  const getArticle = (id: string) => allArticles?.find((a) => a.id === id);

  const totalRead = myReviews.length;
  const avgRating =
    myReviews.length > 0
      ? (
          myReviews.reduce((a, b) => a + b.rating, 0) / myReviews.length
        ).toFixed(1)
      : "0";

  return (
    <div>
      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center gap-6 border-b border-slate-800 pb-8 md:flex-row md:items-end">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#14181c] bg-emerald-900 text-4xl font-bold text-emerald-400 shadow-xl md:h-32 md:w-32">
          {user.email[0].toUpperCase()}
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Scholar
          </h2>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {user.email.split("@")[0]}
          </h1>
        </div>
        <div className="flex gap-6 px-6 md:gap-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalRead}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Read
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {myReviews.filter((r) => r.liked).length}
            </div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Liked
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{avgRating}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Avg Rating
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Content */}
      <div className="space-y-8">
        <h3 className="border-b border-slate-800 pb-2 text-sm font-bold uppercase tracking-widest text-slate-500">
          Recent Activity
        </h3>

        <div className="grid gap-4">
          {myReviews.map((review) => {
            const article = getArticle(review.article_id);
            if (!article) return null;

            return (
              <div
                key={review.id}
                className="flex gap-4 rounded-lg border border-slate-800 bg-[#1b2228] p-4 transition-colors hover:border-slate-700"
              >
                <div className="h-24 w-16 flex-shrink-0">
                  <div className="flex h-full w-full items-center justify-center rounded bg-slate-800 p-1 text-center text-[8px] text-slate-400">
                    {article.title}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-serif text-lg font-bold text-slate-200">
                      {article.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {format(new Date(review.created_date), "MMM d")}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    {review.liked && (
                      <span className="text-xs text-rose-500">♥</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{review.content}</p>
                </div>
              </div>
            );
          })}
          {myReviews.length === 0 && (
            <div className="py-10 text-center italic text-slate-500">
              You haven&apos;t logged any papers yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
