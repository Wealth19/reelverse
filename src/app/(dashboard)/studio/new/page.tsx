"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { z } from "zod";
import {
  ArrowLeft,
  Clapperboard,
  Film,
  Clock,
  Calendar,
  Image as ImageIcon,
  Video,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import PosterArt from "@/components/movie/PosterArt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import { createMovie } from "@/services/movie.service";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  genre: z.string().optional(),
  duration: z.string().optional(),
  release_year: z.string().optional(),
  poster_url: z
    .string()
    .url("Enter a valid poster URL")
    .optional()
    .or(z.literal("")),
  trailer_url: z
    .string()
    .url("Enter a valid YouTube trailer URL")
    .optional()
    .or(z.literal("")),
  rental_price: z.number().min(0, "Rental price is required"),
  purchase_price: z.number().min(0, "Purchase price is required"),
});

type FormValues = z.infer<typeof schema>;

export default function NewMoviePage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      genre: "Drama",
      duration: "2h 05m",
      release_year: String(new Date().getFullYear()),
      poster_url: "",
      trailer_url: "",
      rental_price: 1500,
      purchase_price: 4500,
    },
  });

  const watchedTitle = watch("title");
  const watchedGenre = watch("genre");
  const watchedPoster = watch("poster_url");
  const watchedRental = watch("rental_price");
  const watchedPurchase = watch("purchase_price");

  useEffect(() => {
    if (user && user.role !== "producer") {
      router.replace("/movies");
    }
  }, [user, router]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMovie({
        ...values,
        poster_url: values.poster_url || undefined,
        trailer_url: values.trailer_url || undefined,
        genre: values.genre || undefined,
        duration: values.duration || undefined,
        release_year: values.release_year
          ? Number(values.release_year)
          : undefined,
      });
      toast.success("Movie published to catalog!");
      router.push("/studio");
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Could not create this movie.");
    }
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <button
        type="button"
        onClick={() => router.push("/studio")}
        className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[#b8ab98] transition hover:text-[#d4a24c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Author Studio
      </button>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4a24c]">
          Publish New Release
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Upload a Movie Listing
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[#cbbba4]">
          Provide your film metadata, official YouTube trailer link, and
          customer pricing for timed rentals and permanent ownership.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-3xl border border-[#2a241c] bg-[#141118] p-6 sm:p-8 shadow-2xl"
        >
          <div>
            <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
              Movie Title *
            </label>
            <div className="relative">
              <Clapperboard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
              <Input
                placeholder="e.g. Echoes of Lagos"
                className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-10 text-sm text-white"
                {...register("title")}
              />
            </div>
            {errors.title && (
              <p className="mt-1.5 text-xs text-amber-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
              Synopsis
            </label>
            <Textarea
              placeholder="Write a compelling synopsis for your audience..."
              className="min-h-28 rounded-xl border-[#2a241c] bg-[#08070b]/70 text-sm text-white"
              {...register("description")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                Genre
              </label>
              <div className="relative">
                <Film className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#d4a24c]" />
                <Input
                  placeholder="Action, Drama..."
                  className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-9 text-sm text-white"
                  {...register("genre")}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                Duration
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#d4a24c]" />
                <Input
                  placeholder="2h 18m"
                  className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-9 text-sm text-white"
                  {...register("duration")}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                Release Year
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#d4a24c]" />
                <Input
                  type="number"
                  placeholder="2026"
                  className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-9 text-sm text-white"
                  {...register("release_year")}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                Poster Image URL
              </label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
                <Input
                  placeholder="https://..."
                  className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-10 text-sm text-white"
                  {...register("poster_url")}
                />
              </div>
              {errors.poster_url && (
                <p className="mt-1.5 text-xs text-amber-400">
                  {errors.poster_url.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                YouTube Trailer URL
              </label>
              <div className="relative">
                <Video className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4a24c]" />
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 pl-10 text-sm text-white"
                  {...register("trailer_url")}
                />
              </div>
              {errors.trailer_url && (
                <p className="mt-1.5 text-xs text-amber-400">
                  {errors.trailer_url.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                Rental Price (NGN) *
              </label>
              <Input
                type="number"
                min={0}
                placeholder="1500"
                className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 text-sm text-white"
                {...register("rental_price", { valueAsNumber: true })}
              />
              {errors.rental_price && (
                <p className="mt-1.5 text-xs text-amber-400">
                  {errors.rental_price.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#cbbba4]">
                Permanent Purchase Price (NGN) *
              </label>
              <Input
                type="number"
                min={0}
                placeholder="4500"
                className="h-11 rounded-xl border-[#2a241c] bg-[#08070b]/70 text-sm text-white"
                {...register("purchase_price", { valueAsNumber: true })}
              />
              {errors.purchase_price && (
                <p className="mt-1.5 text-xs text-amber-400">
                  {errors.purchase_price.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#2a241c] pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/studio")}
              className="h-11 cursor-pointer rounded-xl border-[#2a241c] bg-[#08070b]/60 px-5 text-xs text-[#cbbba4] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 cursor-pointer rounded-xl bg-[#d4a24c] px-6 text-xs font-semibold text-[#08070b] transition hover:bg-amber-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Publish Listing
                </>
              )}
            </Button>
          </div>
        </form>

        {/* LIVE POSTER PREVIEW */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8ab98]">
            Catalog Preview
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#2a241c] bg-[#141118] p-3">
            <div className="aspect-3/4 overflow-hidden rounded-xl border border-[#2a241c]">
              <PosterArt
                title={watchedTitle?.trim() || "Untitled Film"}
                image={watchedPoster?.trim() || undefined}
              />
            </div>
            <div className="mt-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d4a24c]">
                {watchedGenre || "Feature"}
              </span>
              <h3 className="mt-0.5 truncate font-semibold text-white">
                {watchedTitle?.trim() || "Untitled Film"}
              </h3>
              <p className="mt-1 text-xs text-[#b8ab98]">
                Rent {formatMoney(watchedRental || 0)} · Buy{" "}
                {formatMoney(watchedPurchase || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
