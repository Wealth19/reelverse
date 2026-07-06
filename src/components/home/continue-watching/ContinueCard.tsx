"use client";

import Image from "next/image";
import { Play } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ContinueCardProps {
  title: string;
  image: string;
  duration: string;
  progress: number;
}

export default function ContinueCard({
  title,
  image,
  duration,
  progress,
}: ContinueCardProps) {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/10">
      <div className="relative h-56">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>

          <p className="text-sm text-slate-400">{duration}</p>
        </div>

        <Progress value={progress} />

        <p className="text-sm text-slate-400">{progress}% watched</p>

        <Button className="w-full bg-red-600 hover:bg-red-700 cursor-pointer">
          <Play className="mr-2 h-4 w-4 fill-white" />
          Resume Watching
        </Button>
      </CardContent>
    </Card>
  );
}
