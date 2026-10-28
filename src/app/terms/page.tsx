import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#cbbba4] transition hover:text-[#d4a24c]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to ReelVerse
        </Link>

        <div className="mt-6 rounded-3xl border border-[#2a241c] bg-[#141118] p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2a241c] bg-[#1b1522] text-[#d4a24c]">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a24c]">
                Legal Agreement
              </p>
              <h1 className="text-3xl font-bold text-white">
                Terms of Service
              </h1>
            </div>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#cbbba4]">
            <section>
              <h2 className="text-base font-semibold text-white">
                1. Overview of ReelVerse
              </h2>
              <p className="mt-2">
                ReelVerse is a digital cinema platform connecting film lovers
                (&ldquo;Customers&rdquo;) with independent filmmakers and rights
                holders (&ldquo;Authors&rdquo; / &ldquo;Producers&rdquo;). By
                creating an account or using ReelVerse, you agree to these Terms
                of Service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">
                2. Customer Wallet, Rentals & Purchases
              </h2>
              <p className="mt-2">
                Customers can fund their digital wallet via Monnify-secured
                payments. Timed rentals grant streaming access for the selected
                duration (1, 3, or 7 days). Permanent purchases grant lifetime
                streaming access in your ReelVerse Library while the title
                remains hosted on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">
                3. Author Studio & Content Rights
              </h2>
              <p className="mt-2">
                Authors who upload movie listings, posters, and trailers affirm
                that they hold the necessary distribution rights for the content
                published. ReelVerse provides real-time tracking of views,
                customer rentals, and permanent sales inside the Author Studio.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">
                4. Account Security
              </h2>
              <p className="mt-2">
                You are responsible for maintaining the confidentiality of your
                login credentials, whether signing in via email/password or
                Google authentication.
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a241c] pt-6 text-xs text-[#b8ab98]">
            <span className="inline-flex items-center gap-1.5 text-[#d4a24c]">
              <ShieldCheck className="h-4 w-4" />
              Last updated: October 2026
            </span>
            <Link
              href="/privacy"
              className="font-semibold text-[#d4a24c] hover:underline"
            >
              Read Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

