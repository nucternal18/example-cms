"use client";

import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Content Management System</h2>
      </div>
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/login" />
      </div>
    </header>
  );
}
