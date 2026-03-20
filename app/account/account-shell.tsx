"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {PropsWithChildren} from "react";

const tabs = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/account/orders" },
];

export default function AccountShell({
  children,
}: PropsWithChildren) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
      <div className="mb-8 flex border-b-2 border-[var(--border)]">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 py-3 text-center font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] transition-colors sm:flex-none sm:px-8 ${
                active
                  ? "border-b-[3px] border-[var(--accent)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
  );
}
