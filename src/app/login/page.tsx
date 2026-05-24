"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { signInWithApple, signInWithGoogle } from "@/lib/auth/socialAuth";

const LOGIN_BG_SRC = "/Images/login-bg.jpeg";
const LOGIN_LOGO_SRC = "/logos/logo only.png";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(
    null
  );

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    router.push("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    if (socialLoading) return;
    setSocialLoading("google");
    try {
      await signInWithGoogle((path) => router.push(path));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    if (socialLoading) return;
    setSocialLoading("apple");
    try {
      await signInWithApple((path) => router.push(path));
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="relative flex min-h-screen min-h-[100dvh] items-center justify-center overflow-hidden">
      {/* Full-page background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${LOGIN_BG_SRC}')` }}
        aria-hidden
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      {/* Login card */}
      <div className="login-card-border-wrap relative z-10 mx-4 w-full max-w-sm">
        <div className="login-glass-card relative rounded-2xl p-8 backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center">
            <Image
              src={LOGIN_LOGO_SRC}
              alt="StoryGen"
              width={146}
              height={101}
              priority
              className="mb-4 h-[55px] w-auto"
            />
            <h1 className="text-xl font-semibold text-white">Welcome to StoryGen</h1>
          </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm text-text placeholder-text-dim transition-all focus:border-accent/50 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 pr-10 text-sm text-text placeholder-text-dim transition-all focus:border-accent/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-dim transition-all duration-300 ease hover:scale-[1.02] hover:text-text-muted"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="btn-login-primary block w-full rounded-xl py-3 text-center text-sm font-semibold"
          >
            Log in
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wide text-white/50">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={socialLoading !== null}
            className="btn-login-social flex w-full items-center justify-center gap-3 rounded-xl bg-[#22c55e] px-4 py-3 text-sm font-semibold text-black transition-all duration-300 ease hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            {socialLoading === "google" ? "Signing in..." : "Log in with Google"}
          </button>

          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={socialLoading !== null}
            className="btn-login-social flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black shadow-sm transition-all duration-300 ease hover:bg-[#f5f5f7] active:bg-[#ebebed] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaApple className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {socialLoading === "apple" ? "Signing in..." : "Continue with Apple"}
          </button>

          <div className="pt-1 text-center">
            <button
              type="button"
              className="cursor-pointer text-sm text-white/70 transition-all duration-300 ease hover:scale-[1.02] hover:text-white"
            >
              Forgot Password
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
