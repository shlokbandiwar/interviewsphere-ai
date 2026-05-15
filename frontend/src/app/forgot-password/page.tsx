"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { requestPasswordReset, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await requestPasswordReset(email);
    if (success) {
      setSent(true);
    } else {
      setError("Unable to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 gradient-hero">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo/8 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold gradient-text">{APP_NAME}</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Enter the email associated with your account and we&apos;ll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl bg-muted/50 border-border" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 transition-all hover:scale-[1.01] disabled:opacity-50">
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Reset Link <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                <Mail className="h-7 w-7 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm mb-6">
                We sent a password reset link to <strong className="text-foreground">{email}</strong>
              </p>
              <button onClick={() => setSent(false)} className="text-sm text-indigo-light hover:text-indigo">
                Didn&apos;t receive it? Try again
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
