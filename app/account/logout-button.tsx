"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "naystack/auth/client";

export default function LogoutButton() {
  const logout = useLogout();
  const router = useRouter();

  return (
    <button
      onClick={()=> {
        logout()
        router.push("/")
      }}
      className="w-full border-2 border-[var(--accent)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--accent)] transition-all duration-200 hover:bg-[var(--accent)] hover:text-white sm:w-auto"
    >
      Logout
    </button>
  );
}
