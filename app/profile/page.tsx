"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, LogOut, Star, Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import type { RecentMark } from "@/lib/types/api";
import { formatDistanceToNow } from "date-fns";
import StarRating from "@/components/common/StarRating";

interface UserStats {
  totalRead: number;
  totalLiked: number;
  avgRating: number | null;
}

function ProfileContent() {
  const { user, isLoading, login, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentMarks, setRecentMarks] = useState<RecentMark[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Handle ?username=<name> login
  useEffect(() => {
    const usernameParam = searchParams.get("username");
    if (usernameParam && !user) {
      login(usernameParam).then(() => {
        // Remove the query param from URL after login
        router.replace("/profile");
      });
    }
  }, [searchParams, user, login, router]);

  // Fetch user's marks and stats
  useEffect(() => {
    if (!user) return;

    async function fetchUserActivity() {
      setActivityLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/marks?user_id=${user!.id}&limit=10`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: { data: RecentMark[]; stats: UserStats } = await res.json();
        setRecentMarks(data.data);
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch user activity:", err);
      } finally {
        setActivityLoading(false);
      }
    }

    fetchUserActivity();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
        <UserIcon className="h-16 w-16 text-slate-600" />
        <h1 className="font-serif text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-500">Not logged in</p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center">
          <p className="mb-4 text-sm text-slate-400">
            Demo login: visit this page with <code className="rounded bg-slate-700 px-2 py-1">?username=yourname</code>
          </p>
          <p className="text-xs text-slate-500">
            Example: <code className="rounded bg-slate-700 px-2 py-1">/profile?username=alice</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center gap-6 border-b border-slate-800 pb-8 md:flex-row md:items-end">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#14181c] bg-emerald-900 text-4xl font-bold text-emerald-400 shadow-xl md:h-32 md:w-32">
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Scholar
          </h2>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {user.username}
          </h1>
          {user.email && (
            <p className="text-sm text-slate-500">{user.email}</p>
          )}
        </div>
        <div className="flex gap-6 px-6 md:gap-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {stats?.totalRead ?? 0}
            </div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Read
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {stats?.totalLiked ?? 0}
            </div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Liked
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {stats?.avgRating ? stats.avgRating.toFixed(1) : "-"}
            </div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Avg Rating
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mb-8 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="gap-2 border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>

      {/* Activity Section */}
      <div className="space-y-6">
        <h3 className="border-b border-slate-800 pb-2 text-sm font-bold uppercase tracking-widest text-slate-500">
          Recent Activity
        </h3>

        {activityLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : recentMarks.length === 0 ? (
          <div className="py-10 text-center italic text-slate-500">
            You haven&apos;t logged any papers yet.
          </div>
        ) : (
          <div className="space-y-4">
            {recentMarks.map((mark) => (
              <Link
                key={mark.id}
                href={`/articles/${mark.item_id}`}
                className="block rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-slate-700 hover:bg-slate-800/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium text-white">
                      {mark.article_title}
                    </h4>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {mark.article_creators}
                    </p>
                    {mark.note && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                        &ldquo;{mark.note}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    {mark.rating && <StarRating rating={mark.rating} />}
                    {mark.liked && (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  {formatDistanceToNow(new Date(mark.created_at), { addSuffix: true })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileLoading() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}
