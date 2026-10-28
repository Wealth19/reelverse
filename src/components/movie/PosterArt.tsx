"use client";

import { useEffect, useState } from "react";
import { posterPalette } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PosterArtProps {
  title: string;
  image?: string | null;
  className?: string;
}

export default function PosterArt({ title, image, className }: PosterArtProps) {
  const [failed, setFailed] = useState(false);
  const [from, to] = posterPalette(title);
  const initial = title.trim().charAt(0).toUpperCase() || "R";

  useEffect(() => {
    if (!image) return;

    let isCurrent = true;
    const preload = new window.Image();
    preload.onload = () => {
      if (isCurrent) setFailed(false);
    };
    preload.onerror = () => {
      if (isCurrent) setFailed(true);
    };
    preload.src = image;

    return () => {
      isCurrent = false;
      preload.onload = null;
      preload.onerror = null;
    };
  }, [image]);

  const showImage = Boolean(image) && !failed;

  if (showImage) {
    return (
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-[#1b1420]",
          className,
        )}
      >
        <div
          role="img"
          aria-label={`${title} poster`}
          className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/80 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-end overflow-hidden p-4",
        className,
      )}
      style={{
        background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,.25)_3px)] opacity-30 mix-blend-overlay" />
      <div className="absolute right-3 top-3 text-5xl font-black text-white/15">
        {initial}
      </div>
      <p className="relative z-10 line-clamp-3 text-left text-sm font-semibold leading-5 text-white drop-shadow">
        {title}
      </p>
    </div>
  );
}
