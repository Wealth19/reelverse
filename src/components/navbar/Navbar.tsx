"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Film,
  User,
  Heart,
  Bookmark,
  Wallet,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv-shows", label: "TV Shows" },
  { href: "/genres", label: "Genres" },
  { href: "/top-rated", label: "Top Rated" },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-red-600 text-[10px] text-white">
            <Film className="h-3.5 w-3.5" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Reel<span className="text-red-600">Verse</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-6 text-xs transition hover:text-white ${
                pathname === link.href ? "text-red-500" : "text-slate-300"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <label className="hidden h-9 w-48 items-center gap-2 rounded-full bg-white/5 px-3 text-slate-400 lg:flex">
            <Search className="h-4 w-4" />
            <input
              aria-label="Search movies"
              placeholder="Search movies..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
            />
          </label>

          <button
            type="button"
            aria-label="Notifications"
            className="relative hidden cursor-pointer text-slate-300 transition hover:text-white md:block"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] text-white">
              3
            </span>
          </button>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-red-600 px-3 py-2 text-xs transition hover:bg-red-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-red-600 px-3 py-2 text-xs transition hover:bg-red-700"
              >
                Register
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent p-0 outline-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 cursor-pointer border-0 bg-slate-900"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-3 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/favorites">
                    <Heart className="mr-3 h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/watchlist">
                    <Bookmark className="mr-3 h-4 w-4" />
                    Watchlist
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/wallet">
                    <Wallet className="mr-3 h-4 w-4" />
                    Wallet
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen((open) => !open)}
            className="cursor-pointer text-slate-300 xl:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-slate-950 px-4 py-3 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm ${pathname === link.href ? "bg-red-600 text-white" : "text-slate-300 hover:bg-white/5"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
