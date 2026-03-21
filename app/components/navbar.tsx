"use client";

import Link from "next/link";
import { useState } from "react";
import { useToken } from "naystack/auth/client";
import AuthModal from "./auth-modal";
import Image from "next/image";
import { User } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart/cart-context";

export default function Navbar() {
  const token = useToken();
  const [showAuth, setShowAuth] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <nav className="flex items-center justify-between border-b-2 border-[var(--foreground)] bg-[var(--surface)] px-4 py-3 sm:px-6 sm:py-4 md:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--foreground)]"
        >
          <Image src={'/black-transparent-logo.png'} alt={"SOGA"} width={32} height={32}/>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {token ? (
            <Link
              href="/account"
              className="p-2 text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]"
            >
              <User size={18} weight="bold" />
            </Link>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="p-2 text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]"
            >
              <User size={18} weight="bold" />
            </button>
          )}
          <Link
            href="/checkout"
            className="border-2 border-[var(--foreground)] bg-[var(--foreground)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]"
          >
            Cart ({totalItems})
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
