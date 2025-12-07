"use client";

import { User } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <User className="h-16 w-16 text-slate-600" />
      <h1 className="font-serif text-2xl font-bold text-white">Profile</h1>
      <p className="text-slate-500">Coming soon - user authentication required</p>
    </div>
  );
}
