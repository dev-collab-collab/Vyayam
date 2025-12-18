"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/calories", label: "Calories" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const showDashboardNav = pathname?.startsWith("/dashboard") ?? false;

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-blue-700">
          Vyayam Coach
        </Link>
        {showDashboardNav ? (
          <div className="flex items-center gap-4 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md hover:bg-blue-50 ${
                  pathname === link.href ? "text-blue-700 font-semibold" : "text-slate-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? "Signing out..." : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Link href="/auth/login" className="hover:text-blue-700">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-600"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
