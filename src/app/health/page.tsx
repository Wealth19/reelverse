"use client";

import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  service: string;
  checks?: {
    backend?: {
      status: string;
    };
    database?: {
      status: string;
    };
  };
}

const serviceNames = ["Frontend", "Backend", "Database"];

export default function HealthPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      setHealth(await response.json());
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void checkHealth();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const statuses = [
    health?.status === "ok" ? "ok" : "error",
    health?.checks?.backend?.status === "ok" ? "ok" : "error",
    health?.checks?.database?.status === "ok" ? "ok" : "error",
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
            System status
          </p>
          <h1 className="mt-2 text-4xl font-bold">Service health</h1>
          <p className="mt-2 text-slate-400">
            Live status for the MovieBox stack.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {serviceNames.map((name, index) => (
            <div
              key={name}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{name}</h2>
                <span
                  className={`h-3 w-3 rounded-full ${statuses[index] === "ok" ? "bg-emerald-400" : "bg-red-500"}`}
                />
              </div>
              <p className="mt-3 text-sm capitalize text-slate-400">
                {loading ? "checking" : statuses[index]}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={checkHealth}
          className="mt-6 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
        >
          Check again
        </button>
      </div>
    </main>
  );
}
