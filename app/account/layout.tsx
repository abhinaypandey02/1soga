"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/account/orders" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page Title */}
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--foreground)] sm:mb-8 sm:text-5xl">
        MY ACCOUNT
      </h1>

      {/* Tab Navigation */}
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

      {children}
    </div>
  );
}
