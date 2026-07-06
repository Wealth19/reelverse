"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Stay Updated</h3>

      <p className="text-slate-400">
        Subscribe for new releases and exclusive updates.
      </p>

      <div className="flex gap-3">
        <Input placeholder="Enter your email" />

        <Button className="bg-red-600 hover:bg-red-700">Subscribe</Button>
      </div>
    </div>
  );
}
