import Link from "next/link";
import { Clapperboard, ShieldCheck, Film, Wallet } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

import FooterLinks from "./FooterLinks";
import NewsletterForm from "./NewsletterForm";
import SocialLinks from "./SocialLinks";

const highlights = [
  { icon: Film, label: "4K & HD Screenings" },
  { icon: Wallet, label: "Instant Wallet Purse" },
  { icon: ShieldCheck, label: "Monnify Secured" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[#2a241c] bg-[#0b090f] text-[#f6f0e6]">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-64 w-96 rounded-full bg-[#d4a24c]/5 blur-3xl" />

      <SectionContainer className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* BRAND & STORY */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#d4a24c] to-[#b8842f] text-[#08070b] shadow-md">
                  <Clapperboard className="h-4 w-4" />
                </span>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Reel<span className="text-[#d4a24c]">Verse</span>
                </span>
              </Link>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#cbbba4]">
                A curated digital cinema house built for movie lovers and
                independent authors. Fund your purse, rent for the weekend, or
                own your favorite films forever.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {highlights.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2a241c] bg-[#141118] px-3 py-1 text-xs text-[#b8ab98]"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#d4a24c]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#b8ab98]">
                Connect with ReelVerse
              </p>
              <SocialLinks />
            </div>
          </div>

          {/* NEWSLETTER + NAVIGATION LINKS */}
          <div className="space-y-10 lg:col-span-7">
            <NewsletterForm />
            <FooterLinks />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#2a241c]/80 pt-8 text-xs text-[#b8ab98] sm:flex-row">
          <p>© {currentYear} ReelVerse Cinema. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center gap-2 text-[#cbbba4]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              All screening rooms operational
            </span>
            <Link href="/movies" className="transition hover:text-[#d4a24c]">
              Catalog
            </Link>
            <Link href="/terms" className="transition hover:text-[#d4a24c]">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-[#d4a24c]">
              Privacy
            </Link>
            <Link href="/profile" className="transition hover:text-[#d4a24c]">
              Account
            </Link>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
