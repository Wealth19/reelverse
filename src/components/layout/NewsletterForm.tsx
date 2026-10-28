"use client";

import { useState } from "react";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribed(true);
    setEmail("");
    toast.success("You're on the ReelVerse premiere list!");
  };

  return (
    <div className="rounded-2xl border border-[#2a241c] bg-linear-to-br from-[#1b1420]/90 via-[#141118] to-[#0f0c14] p-6 shadow-xl">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d4a24c]">
        <Sparkles className="h-3.5 w-3.5" />
        Premiere Dispatch
      </div>

      <h3 className="mt-2 text-xl font-bold text-white">
        Stay in the Front Row
      </h3>

      <p className="mt-1.5 text-xs leading-relaxed text-[#b8ab98]">
        Get notified when authors drop new feature films, exclusive screenings,
        and limited-time rental specials.
      </p>

      {subscribed ? (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Subscribed! Watch your inbox for upcoming premieres.</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-2.5 sm:flex-row"
        >
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address for newsletter"
              className="h-10 rounded-xl border-[#2a241c] bg-[#08070b]/80 pl-10 text-xs text-white placeholder:text-[#6f6558] focus-visible:border-[#d4a24c]"
            />
          </div>

          <Button
            type="submit"
            className="h-10 cursor-pointer rounded-xl bg-[#d4a24c] px-5 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
          >
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
