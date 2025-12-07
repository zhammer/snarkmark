"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Loader2 } from "lucide-react";
import ArticleCard from "@/components/common/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ArticlesResponse, JstorArticle } from "@/lib/types/api";

export default function Articles() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [articles, setArticles] = useState<JstorArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    ArticlesResponse["pagination"] | null
  >(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "24",
        });
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }
        const res = await fetch(`/.netlify/functions/articles?${params}`);
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data: ArticlesResponse = await res.json();
        setArticles(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [page, debouncedSearch]);

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
              placeholder="Search titles, authors..."
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

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      )}

      {error && (
        <div className="py-20 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {articles.map((article) => (
              <ArticleCard key={article.item_id} article={article} />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="py-20 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-700" />
              <p className="text-slate-500">
                {search
                  ? `No articles found matching "${search}"`
                  : "No articles found"}
              </p>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                variant="outline"
                className="border-slate-700 bg-[#1b2228] text-slate-300"
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                className="border-slate-700 bg-[#1b2228] text-slate-300"
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
