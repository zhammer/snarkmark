"use client";

import { useState } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import ArticleCard from "@/components/common/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/data";

export default function Articles() {
  const [search, setSearch] = useState("");

  const { data: articles } = api.articles.list({ limit: 50 });
  const { data: reviews } = api.reviews.list();

  const filteredArticles =
    articles?.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.authors?.some((au) =>
          au.toLowerCase().includes(search.toLowerCase())
        ) ||
        a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    ) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-end justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-slate-400">
            Browse
          </h2>
          <h1 className="font-serif text-3xl font-bold text-white">
            All Papers
          </h1>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search titles, authors, tags..."
              className="border-slate-700 bg-[#1b2228] pl-9 text-slate-200 focus-visible:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-slate-700 bg-[#1b2228] text-slate-400"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} reviews={reviews} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="py-20 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-700" />
          <p className="text-slate-500">
            No articles found matching &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
