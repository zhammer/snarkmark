import Link from "next/link";
import { User, Home, Search } from "lucide-react";

export default function Navigation() {

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/articles", label: "Browse", icon: Search },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#14181c]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold">Snarkmark</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-emerald-500"
                >
                  <Icon className="h-4 w-4" />
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
