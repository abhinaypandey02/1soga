import AccountShell from "./account-shell";
import {Suspense} from "react";
import { getSEO } from "@/lib/seo";

export const metadata = getSEO("My Account", "Manage your ONE SOGA membership. View your profile, orders, and stay connected to the scenic capital of the NCR.");

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page Title */}
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--foreground)] sm:mb-8 sm:text-5xl">
        MY ACCOUNT
      </h1>
      
      <Suspense>
      <AccountShell/>
      </Suspense>
      {children}</div>;
}

