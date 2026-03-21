"use client";

import { useState } from "react";
import { useToken } from "naystack/auth/client";
import AuthModal from "./auth-modal";

export default function DeclareCTA() {
  const token = useToken();
  const [showAuth, setShowAuth] = useState(false);

  const handleClick = () => {
    if (!token) {
      setShowAuth(true);
    } else {
      window.location.href = "/#drops";
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-block w-full border-2 border-white bg-white px-10 py-4 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)] transition-all duration-200 hover:bg-transparent hover:text-white sm:w-auto"
      >
        Declare Your Side
      </button>
      {showAuth && (
        <AuthModal
          open
          onClose={() => setShowAuth(false)}
          onAuth={() => {
            setShowAuth(false);
            window.location.href = "/#drops";
          }}
        />
      )}
    </>
  );
}
