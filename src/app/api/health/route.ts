import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl =
    process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:5000";

  try {
    const response = await fetch(`${backendUrl}/health`, {
      cache: "no-store",
    });
    const backend = await response.json();

    return NextResponse.json(
      {
        status: response.ok ? "ok" : "error",
        service: "frontend",
        timestamp: new Date().toISOString(),
        checks: {
          backend: {
            status: backend.status === "ok" ? "ok" : "error",
          },
          database: backend.checks?.database ?? { status: "error" },
        },
      },
      { status: response.ok ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        service: "frontend",
        timestamp: new Date().toISOString(),
        checks: {
          backend: { status: "unreachable" },
          database: { status: "unknown" },
        },
      },
      { status: 503 },
    );
  }
}
