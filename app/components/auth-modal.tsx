"use client";

import { useState } from "react";
import { useLogin, useSignUp } from "naystack/auth/client";
import Modal from "./modal";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onAuth: () => void;
};

export default function AuthModal({ open, onClose, onAuth }: AuthModalProps) {
  const login = useLogin();
  const signUp = useSignUp();

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthLoading(true);
    try {
      const authError = isSignUp
        ? await signUp({ email, password, name })
        : await login({ email, password });
      if (authError) {
        setError(authError);
      } else {
        onAuth();
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          &#10005;
        </button>
      </div>

      <form onSubmit={handleAuth}>
        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}
        {isSignUp && (
          <div className="mb-4">
            <label className="mb-1 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-[family-name:var(--font-body)] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="mb-1 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-[family-name:var(--font-body)] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-[family-name:var(--font-body)] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <button
          type="submit"
          disabled={authLoading}
          className="w-full border-2 border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {authLoading ? "PROCESSING..." : isSignUp ? "SIGN UP" : "LOGIN"}
        </button>
        <p className="mt-4 text-center font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-[var(--accent)] underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </Modal>
  );
}
