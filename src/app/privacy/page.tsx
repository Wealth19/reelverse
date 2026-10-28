import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";

export default function PrivacyPage() {
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
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a24c]">
                Data Protection
              </p>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            </div>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#cbbba4]">
            <section>
              <h2 className="text-base font-semibold text-white">
                1. Information We Collect
              </h2>
              <p className="mt-2">
                We collect your name, email address, account role (Customer or
                Author), wallet transaction records, and library activity
                (rentals, purchases, and watch history) to operate your
                ReelVerse experience.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">
                2. Google & Email Authentication
              </h2>
              <p className="mt-2">
                When you sign in with Google, we only receive your basic profile
                information (name and verified email address) to authenticate
                your account and link it with your ReelVerse profile.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">
                3. Payment Processing
              </h2>
              <p className="mt-2">
                Wallet top-ups are processed securely by Monnify. ReelVerse does
                not store your raw card numbers or bank login credentials on our
                servers.
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a241c] pt-6 text-xs text-[#b8ab98]">
            <span className="inline-flex items-center gap-1.5 text-[#d4a24c]">
              <ShieldCheck className="h-4 w-4" />
              Last updated: October 2026
            </span>
            <Link
              href="/terms"
              className="font-semibold text-[#d4a24c] hover:underline"
            >
              Read Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

