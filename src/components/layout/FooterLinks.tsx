"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function FooterLinks() {
  const { isAuthenticated, user } = useAuth();
  const isAuthor = user?.role === "producer";
  const isAdmin = user?.role === "admin";

  const sections = [
    {
      title: "Explore",
      items: [
        { label: "Home", href: "/" },
        { label: "Movie Catalog", href: "/movies" },
        { label: "New Releases", href: "/movies" },
        ...(isAuthor
          ? [{ label: "Author Studio", href: "/studio" }]
          : isAdmin
            ? [{ label: "Control Room", href: "/admin" }]
            : [{ label: "My Library", href: "/library" }]),
      ],
    },
    {
      title: "Account",
      items: isAuthenticated
        ? [
            { label: "My Profile", href: "/profile" },
            { label: "Edit Profile", href: "/profile/edit" },
            { label: "Change Password", href: "/profile/change-password" },
            ...(isAuthor
              ? [{ label: "Upload Movie", href: "/studio/new" }]
              : !isAdmin
                ? [{ label: "My Wallet", href: "/wallet" }]
                : []),
          ]
        : [
            { label: "Sign In", href: "/login" },
            { label: "Create Account", href: "/register" },
            { label: "Forgot Password", href: "/forgot-password" },
            { label: "Browse Titles", href: "/movies" },
          ],
    },
    {
      title: "Cinema House",
      items: [
        { label: "Timed Rentals", href: "/movies" },
        { label: "Lifetime Purchases", href: "/movies" },
        { label: "Wallet Top-Up", href: isAuthenticated ? "/wallet" : "/login" },
        {
          label: "Publish as Author",
          href: isAuthenticated && isAuthor ? "/studio/new" : "/register",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a24c]">
            {section.title}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {section.items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[#cbbba4] transition hover:text-[#d4a24c]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
