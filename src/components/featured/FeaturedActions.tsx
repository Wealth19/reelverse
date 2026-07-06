"use client";

import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";

export default function FeaturedActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Button size="lg" className="bg-red-600 hover:bg-red-700">
        <Play className="mr-2 h-5 w-5 fill-white" />
        Watch Now
      </Button>

      <Button size="lg" variant="secondary">
        <Plus className="mr-2 h-5 w-5" />
        My List
      </Button>
    </div>
  );
}
