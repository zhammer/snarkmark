"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Loader2 } from "lucide-react";
import ArticleCard from "@/components/common/ArticleCard";
import type { ArticlesResponse, JstorArticle } from "@/lib/types/api";

export default function Home() {
  const [articles, setArticles] = useState<JstorArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/.netlify/functions/articles?limit=6");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ArticlesResponse = await res.json();
        setArticles(data.data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6">
            {articles.map((article) => (
              <ArticleCard key={article.item_id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
