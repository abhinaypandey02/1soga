"use client";

import Link from "next/link";
import { useState } from "react";
import { useToken } from "naystack/auth/client";
import AuthModal from "./auth-modal";
import {usePathname} from "next/navigation";

export default function Navbar() {
  const token = useToken();
  const [showAuth, setShowAuth] = useState(false);
  const path = usePathname()

  return (
    <>
      <nav className="flex items-center justify-between border-b-2 border-[var(--foreground)] bg-[var(--surface)] px-4 py-3 sm:px-6 sm:py-4 md:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--foreground)]"
        >
          ONE SOGA
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)] md:inline">
            The NCR Movement
          </span>
          {path.startsWith('/account')?null:token ? (
            <Link
              href="/account"
              className="border-2 border-[var(--border)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)] transition-all duration-200 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
            >
              Account
            </Link>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="border-2 border-[var(--border)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)] transition-all duration-200 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
            >
              Join Now
            </button>
          )}
          <Link
            href="/#drops"
            className="border-2 border-[var(--foreground)] bg-[var(--foreground)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]"
          >
            Shop
          </Link>
        </div>
      </nav>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={() => setShowAuth(false)}
      />
    </>
  );
}
