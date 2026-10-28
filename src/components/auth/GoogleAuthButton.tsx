"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  Clapperboard,
  Loader2,
  Mail,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { googleLogin } from "@/services/auth.service";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: () => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  mode?: "login" | "register";
  defaultRole?: "customer" | "producer";
}

const QUICK_GOOGLE_ACCOUNTS = [
  {
    name: "Adaobi Okafor",
    email: "adaobi.okafor@gmail.com",
    role: "customer" as const,
    tag: "Customer Account",
  },
  {
    name: "Tunde Bakare Studios",
    email: "tunde.studios@gmail.com",
    role: "producer" as const,
    tag: "Author / Producer",
  },
];

export default function GoogleAuthButton({
  mode = "login",
  defaultRole = "customer",
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "producer">(
    defaultRole,
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    if (!googleClientId) return;
    if (document.getElementById("google-gis-script")) return;

    const script = document.createElement("script");
    script.id = "google-gis-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [googleClientId]);

  const completeGoogleSignIn = async (payload: {
    credential?: string;
    accessToken?: string;
    email?: string;
    name?: string;
    role?: "customer" | "producer";
  }) => {
    try {
      setLoading(true);
      const response = await googleLogin(payload);
      loginUser(response.data.user, response.data.access.token);
      toast.success(response.message || "Signed in with Google!");
      setModalOpen(false);

      const destination =
        response.data.user.role === "admin"
          ? "/admin"
          : response.data.user.role === "producer"
            ? "/studio"
            : "/movies";
      router.push(destination);
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (googleClientId && window.google?.accounts?.oauth2) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: (tokenResponse) => {
          if (tokenResponse.access_token) {
            void completeGoogleSignIn({
              accessToken: tokenResponse.access_token,
              role: selectedRole,
            });
          }
        },
      });
      tokenClient.requestAccessToken();
      return;
    }

    // No NEXT_PUBLIC_GOOGLE_CLIENT_ID configured yet -> open interactive Google Account Chooser
    setModalOpen(true);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = customEmail.trim().toLowerCase();
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast.error("Please enter a valid Google email address.");
      return;
    }

    void completeGoogleSignIn({
      email: trimmedEmail,
      name: customName.trim() || trimmedEmail.split("@")[0],
      role: selectedRole,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className=" flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#2a241c] bg-[#141118] px-4 text-sm font-semibold text-[#e6dccb] transition hover:border-[#d4a24c]/50 hover:bg-[#1a1520] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#d4a24c]" />
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-label="Google">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>
          {mode === "register"
            ? "Sign up with Google"
            : "Continue with Google"}
        </span>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#2a241c] bg-[#141118] p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#2a241c] bg-[#08070b]/60 text-[#b8ab98] transition hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a241c] bg-[#08070b]">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  aria-label="Google"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Choose a Google Account
                </h3>
                <p className="text-xs text-[#b8ab98]">
                  Continue to <span className="text-[#d4a24c]">ReelVerse</span>
                </p>
              </div>
            </div>

            {/* Quick demo accounts */}
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b8ab98]">
                One-Tap Instant Sign In
              </p>
              {QUICK_GOOGLE_ACCOUNTS.map((acct) => (
                <button
                  key={acct.email}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    void completeGoogleSignIn({
                      email: acct.email,
                      name: acct.name,
                      role: acct.role,
                    })
                  }
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#2a241c] bg-[#08070b]/70 px-3.5 py-2.5 text-left transition hover:border-[#d4a24c]/50 hover:bg-[#1b1522]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4a24c]/15 text-xs font-bold text-[#d4a24c]">
                      {acct.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {acct.name}
                      </p>
                      <p className="text-[11px] text-[#b8ab98]">{acct.email}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#d4a24c]/30 bg-[#d4a24c]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#d4a24c]">
                    {acct.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#2a241c]" />
              <span className="text-[11px] text-[#6b6070]">
                or use your own Google email
              </span>
              <div className="h-px flex-1 bg-[#2a241c]" />
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Your Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6070]" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Wealth Okafor"
                    className="h-10 w-full rounded-xl border border-[#2a241c] bg-[#08070b] pl-9 pr-3 text-xs text-white outline-none focus:border-[#d4a24c]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#cbbba4]">
                  Google Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6070]" />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="h-10 w-full rounded-xl border border-[#2a241c] bg-[#08070b] pl-9 pr-3 text-xs text-white outline-none focus:border-[#d4a24c]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#cbbba4]">
                  Account Type (if new account)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("customer")}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      selectedRole === "customer"
                        ? "border-[#d4a24c] bg-[#d4a24c]/15 text-white"
                        : "border-[#2a241c] bg-[#08070b] text-[#b8ab98]"
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[#d4a24c]" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("producer")}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      selectedRole === "producer"
                        ? "border-[#d4a24c] bg-[#d4a24c]/15 text-white"
                        : "border-[#2a241c] bg-[#08070b] text-[#b8ab98]"
                    }`}
                  >
                    <Clapperboard className="h-3.5 w-3.5 text-[#d4a24c]" />
                    Author
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#d4a24c] text-xs font-bold text-[#08070b] transition hover:bg-amber-300 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Continue with Google
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

