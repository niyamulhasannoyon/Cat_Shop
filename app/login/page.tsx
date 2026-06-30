"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, signInWithEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Get redirect path, default to home page
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    // If already logged in, redirect away
    if (user && !loading) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    setSigningIn(true);
    try {
      await signInWithEmail(email, password);
      router.push(redirectTo);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন। দয়া করে আবার চেষ্টা করুন।");
      } else if (err.code === "auth/invalid-email") {
        setError("সঠিক ইমেইল এড্রেস প্রদান করুন।");
      } else {
        setError(err.message || "লগইন করতে সমস্যা হয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      router.push(redirectTo);
    } catch (err: any) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("গুগল সাইন-ইন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      }
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-beige py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-forest border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-charcoal font-medium text-sm">অপেক্ষা করুন...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-brand-beige py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-brand-beige-dark shadow-xl p-8 max-w-md w-full transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-brand-forest mb-1.5">
            Paws<span className="text-brand-charcoal font-light">&Co.</span>-তে স্বাগতম
          </h2>
          <p className="text-stone-500 text-sm">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal mb-1.5">
              ইমেইল অ্যাড্রেস
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full bg-white text-brand-charcoal placeholder-stone-450 text-sm px-4 py-3 rounded-xl border border-brand-beige-dark focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white text-brand-charcoal placeholder-stone-450 text-sm px-4 py-3 rounded-xl border border-brand-beige-dark focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={signingIn}
            className="w-full bg-brand-forest hover:bg-brand-forest-light text-brand-beige font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
          >
            {signingIn ? (
              <div className="w-5 h-5 border-2 border-brand-beige border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-stone-500 uppercase tracking-wide">অথবা</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={signingIn}
          className="w-full border border-stone-300 bg-white hover:bg-stone-50 text-brand-charcoal font-medium py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-98 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.647 5.647 0 0 1 8.35 12.96a5.647 5.647 0 0 1 5.64-5.64c1.554 0 2.966.565 4.056 1.498l3.107-3.107A10.024 10.024 0 0 0 13.99.01C8.477.01 4 4.487 4 10a9.99 9.99 0 0 0 10 9.99c5.514 0 9.99-4.476 9.99-9.99 0-.67-.06-1.32-.178-1.957H12.24Z"
            />
          </svg>
          গুগল দিয়ে লগইন করুন
        </button>

        <div className="mt-8 text-center text-xs text-stone-500">
          কোনো অ্যাকাউন্ট নেই?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-brand-forest font-semibold hover:underline"
          >
            নতুন অ্যাকাউন্ট খুলুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-brand-beige py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-forest border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-charcoal font-medium text-sm">অপেক্ষা করুন...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
