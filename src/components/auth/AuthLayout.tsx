"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/auth/auth-bg.jpg"
          alt="Movie Background"
          fill
          priority
          className="object-cover scale-125 transition-transform duration-700"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div>
            <h1 className="text-5xl font-black tracking-wide text-white">
              🎬 ReelVerse
            </h1>

            <p className="mt-4 max-w-md text-lg text-slate-300">
              Discover thousands of movies, build your watchlist, and enjoy
              cinema like never before.
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white">
              Your next favorite movie
              <br />
              is waiting.
            </h2>

            <p className="mt-4 max-w-md text-slate-300">
              Stream anytime. Anywhere. On any device.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-slate-950 px-6 py-12">
        {children}
      </div>
    </div>
  );
}
