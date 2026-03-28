import { getSEO } from "@/lib/seo";

export const metadata = getSEO("Privacy Policy", "How 1SOGA collects, uses, and protects your data.");

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20">
      <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
        Legal Stuff
      </span>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--foreground)] sm:text-6xl">
        PRIVACY POLICY
      </h1>

      <div className="mt-8 space-y-8 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--muted)] sm:text-base">
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">The Short Version</h2>
          <p>
            We collect only what we need to ship your order and keep things running. We don&apos;t sell your data, we don&apos;t spam you, and we definitely don&apos;t share your address with SoBo folks.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">What We Collect</h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong className="text-[var(--foreground)]">Account info</strong> — name, email, and phone number when you sign up.</li>
            <li><strong className="text-[var(--foreground)]">Shipping details</strong> — address and contact info so your order actually reaches you.</li>
            <li><strong className="text-[var(--foreground)]">Order history</strong> — what you bought, when, and how much you paid.</li>
            <li><strong className="text-[var(--foreground)]">Payment info</strong> — handled entirely by Razorpay. We never see or store your card details.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">How We Use It</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>To process and deliver your orders.</li>
            <li>To let you track your order status.</li>
            <li>To reach out if there&apos;s an issue with your order.</li>
            <li>To make the site work properly (boring but necessary).</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Who We Share It With</h2>
          <p>
            Only the people who need it to get your order to your door:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong className="text-[var(--foreground)]">Razorpay</strong> — for payment processing.</li>
            <li><strong className="text-[var(--foreground)]">Our fulfillment partner</strong> — for printing and shipping.</li>
          </ul>
          <p className="mt-2">
            That&apos;s it. No ad networks, no data brokers, no shady third parties.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Cookies</h2>
          <p>
            We use essential cookies to keep you logged in and your cart intact. No tracking cookies, no creepy stuff following you around the internet.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Your Rights</h2>
          <p>
            Want to know what data we have on you? Want it deleted? Just reach out and we&apos;ll take care of it. You have every right to your own data — we&apos;re not going to fight you on it.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Changes</h2>
          <p>
            If we update this policy, we&apos;ll post the new version here. Nothing dramatic — just keeping things current.
          </p>
        </div>
      </div>
    </section>
  );
}
