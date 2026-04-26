"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  Search,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Tv,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Hide sidebar entirely on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  // Highlight for exact or subroutes (e.g., /posts/123 highlights /posts)
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside className="w-20 bg-black flex flex-col items-center h-screen sticky top-0 border-r border-zinc-800 shadow-2xl py-6 gap-8">
      {/* Logo */}
      <Link
        href="/"
        className="text-blue-500 hover:text-blue-400 transition-colors"
      >
        <Tv size={32} strokeWidth={1.5} />
      </Link>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-8 flex-1">
        <Link
          href="/"
          className={`p-3 rounded-lg transition-all ${isActive("/")
              ? "bg-blue-500/20 text-blue-400"
              : "text-zinc-400 hover:text-blue-400"
            }`}
          title="Home"
        >
          <Home size={24} strokeWidth={1.5} />
        </Link>

        <Link
          href="/posts"
          className={`p-3 rounded-lg transition-all ${isActive("/posts")
              ? "bg-blue-500/20 text-blue-400"
              : "text-zinc-400 hover:text-blue-400"
            }`}
          title="Posts"
        >
          <Calendar size={24} strokeWidth={1.5} />
        </Link>

        <Link
          href="/api-demo"
          className={`p-3 rounded-lg transition-all ${isActive("/api-demo")
              ? "bg-blue-500/20 text-blue-400"
              : "text-zinc-400 hover:text-blue-400"
            }`}
          title="Explore"
        >
          <Search size={24} strokeWidth={1.5} />
        </Link>


      </nav>

      {/* Bottom Settings */}
      <div className="flex flex-col gap-4">
        <button
          className="p-3 rounded-lg transition-all text-zinc-400 hover:text-blue-400"
          title="Settings"
        >
          <Settings size={24} strokeWidth={1.5} />
        </button>

        {user && (
          <button
            onClick={logout}
            className="p-3 rounded-lg transition-all text-zinc-400 hover:text-red-400"
            title="Logout"
          >
            <LogOut size={24} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </aside>
  );
}
