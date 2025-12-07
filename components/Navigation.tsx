"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/articles", label: "Browse", icon: Search },
    { href: "/profile", label: user ? user.username : "Profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#14181c]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block rotate-90 font-serif text-2xl font-bold text-emerald-500">
              ~·
            </span>
            <span className="font-serif text-xl font-bold">Snarkmark</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              const isProfile = link.href === "/profile";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-emerald-500"
                      : "text-slate-400 hover:text-emerald-500"
                  }`}
                >
                  {isProfile && user ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900 text-xs font-bold text-emerald-400">
                      {user.username[0].toUpperCase()}
                    </span>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
