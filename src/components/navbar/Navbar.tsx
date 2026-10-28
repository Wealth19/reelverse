"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Clapperboard,
  User,
  Wallet,
  LogOut,
  ChevronDown,
  Search,
  Menu,
  X,
  Library,
  Plus,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { roleLabel } from "@/lib/format";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalSearchModal from "@/components/search/GlobalSearchModal";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isAuthor = user?.role === "producer";
  const isAdmin = user?.role === "admin";

  const links = useMemo(() => {
    const items = [
      { href: "/", label: "Home" },
      { href: "/movies", label: "Catalog" },
    ];

    if (isAuthenticated && isAdmin) {
      items.push({ href: "/admin", label: "Admin" });
    }

    if (isAuthenticated && !isAuthor && !isAdmin) {
      items.push({ href: "/library", label: "My Library" });
      items.push({ href: "/wallet", label: "Wallet" });
    }

    if (isAuthenticated && isAuthor) {
      items.push({ href: "/studio", label: "Studio" });
    }

    return items;
  }, [isAuthenticated, isAuthor, isAdmin]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/movies?q=${encodeURIComponent(term)}` : "/movies");
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#2a241c]/80 bg-[#08070b]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#d4a24c] to-[#d4a24c] text-[#08070b]">
            <Clapperboard className="h-4 w-4" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            Reel<span className="text-[#d4a24c]">Verse</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-6 text-xs uppercase tracking-[0.18em] transition hover:text-white ${
                pathname === link.href ? "text-[#d4a24c]" : "text-[#cbbba4]"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#d4a24c]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="flex h-9 items-center gap-2.5 rounded-full border border-[#2a241c] bg-white/5 px-3.5 text-xs text-[#b8ab98] transition hover:border-[#d4a24c]/50 hover:bg-white/8 hover:text-white"
          >
            <Search className="h-3.5 w-3.5 text-[#d4a24c]" />
            <span className="hidden sm:inline">Search movies...</span>
            <kbd className="hidden rounded border border-[#2a241c] bg-[#141118] px-1.5 py-0.5 text-[10px] font-mono text-[#6f6558] sm:inline">
              ⌘K
            </kbd>
          </button>

          <GlobalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
          />

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-[#d4a24c] px-3 py-2 text-xs text-[#d4a24c] transition hover:bg-[#d4a24c] hover:text-[#08070b]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#d4a24c] px-3 py-2 text-xs font-medium text-[#08070b] transition hover:bg-amber-300"
              >
                Join
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex cursor-pointer items-center gap-2 rounded-full border border-[#2a241c] bg-[#141118]/90 p-1 pr-2.5 transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522] outline-none">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#d4a24c] to-[#b8842f] text-xs font-bold text-[#08070b] shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden max-w-28 truncate text-xs font-medium text-[#f6f0e6] sm:inline">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#b8ab98] transition-transform duration-200 group-data-popup-open:rotate-180" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-2xl border border-[#2a241c] bg-[#141118]/95 p-2 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 rounded-xl border border-[#2a241c]/60 bg-[#1b1522]/70 px-3 py-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#d4a24c] to-[#b8842f] text-sm font-bold text-[#08070b]">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-[#b8ab98]">
                      {user?.email}
                    </p>
                    <span className="mt-1 inline-block rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#d4a24c]">
                      {roleLabel(user?.role)}
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-1.5 bg-[#2a241c]" />

                <div className="space-y-0.5">
                  <DropdownMenuItem
                    asChild
                    className={
                      pathname.startsWith("/profile")
                        ? "bg-[#1b1522] text-[#d4a24c]"
                        : ""
                    }
                  >
                    <Link
                      href="/profile"
                      className="flex w-full items-center gap-3"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-medium">My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem
                      asChild
                      className={
                        pathname.startsWith("/admin")
                          ? "bg-[#1b1522] text-[#d4a24c]"
                          : ""
                      }
                    >
                      <Link
                        href="/admin"
                        className="flex w-full items-center gap-3"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium">Control Room</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {!isAuthor && !isAdmin && (
                    <>
                      <DropdownMenuItem
                        asChild
                        className={
                          pathname === "/library"
                            ? "bg-[#1b1522] text-[#d4a24c]"
                            : ""
                        }
                      >
                        <Link
                          href="/library"
                          className="flex w-full items-center gap-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                            <Library className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-medium">Library</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        className={
                          pathname === "/favorites"
                            ? "bg-[#1b1522] text-[#d4a24c]"
                            : ""
                        }
                      >
                        <Link
                          href="/favorites"
                          className="flex w-full items-center gap-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                            <Heart className="h-3.5 w-3.5 fill-current" />
                          </span>
                          <span className="font-medium">Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isAuthor && (
                    <>
                      <DropdownMenuItem
                        asChild
                        className={
                          pathname === "/studio"
                            ? "bg-[#1b1522] text-[#d4a24c]"
                            : ""
                        }
                      >
                        <Link
                          href="/studio"
                          className="flex w-full items-center gap-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                            <Clapperboard className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-medium">Author Studio</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        className={
                          pathname === "/studio/new"
                            ? "bg-[#1b1522] text-[#d4a24c]"
                            : ""
                        }
                      >
                        <Link
                          href="/studio/new"
                          className="flex w-full items-center gap-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                            <Plus className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-medium">Upload Movie</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {!isAuthor && !isAdmin && (
                    <DropdownMenuItem
                      asChild
                      className={
                        pathname === "/wallet"
                          ? "bg-[#1b1522] text-[#d4a24c]"
                          : ""
                      }
                    >
                      <Link
                        href="/wallet"
                        className="flex w-full items-center gap-3"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#d4a24c]">
                          <Wallet className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium">Wallet</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>

                <DropdownMenuSeparator className="my-1.5 bg-[#2a241c]" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <LogOut className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium">Logout</span>
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
            className="cursor-pointer text-[#cbbba4] xl:hidden"
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
        <nav className="border-t border-[#2a241c] bg-[#08070b] px-4 py-3 xl:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles..."
              className="h-10 flex-1 rounded-md border border-[#2a241c] bg-white/5 px-3 text-sm outline-none"
            />
          </form>
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm ${pathname === link.href ? "bg-[#d4a24c] text-[#08070b]" : "text-[#cbbba4] hover:bg-white/5"}`}
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
