import { getSEO } from "@/lib/seo";

export const metadata = getSEO("Terms & Conditions", "Terms and conditions for using 1SOGA.");

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20">
      <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
        Legal Stuff
      </span>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--foreground)] sm:text-6xl">
        TERMS &amp; CONDITIONS
      </h1>

      <div className="mt-8 space-y-8 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--muted)] sm:text-base">
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">The Basics</h2>
          <p>
            By using 1soga.com you agree to these terms. If you don&apos;t agree, that&apos;s cool — but maybe don&apos;t buy stuff here then.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">What We Sell</h2>
          <p>
            1SOGA sells merch. Tees, caps, mugs — all the essentials for repping the most naturally blessed region the NCR has ever produced. All products are made to order and printed by our fulfillment partner. Colours may vary slightly from what you see on screen because, well, screens.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">It&apos;s All a Vibe</h2>
          <p>
            1SOGA is a lighthearted, meme-inspired brand celebrating NCR culture. Any references to a &ldquo;movement,&rdquo; &ldquo;revolution,&rdquo; or geographic superiority are purely for laughs. We are not a political organisation, activist group, or geographic survey team. SoBo is probably fine.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Orders &amp; Payments</h2>
          <p>
            Payments are processed securely via Razorpay. Prices are listed in INR and include shipping. Once you place an order, we start making your stuff — so please make sure your details are correct before you hit pay.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Returns &amp; Refunds</h2>
          <p>
            All sales are final. No returns, no exchanges, no refunds. If your order arrives damaged or defective, get in touch within 48 hours and we&apos;ll sort it out. Full details on our{" "}
            <a href="/return-policy" className="font-bold text-[var(--accent)] underline">return policy</a> page.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Your Account</h2>
          <p>
            You&apos;re responsible for keeping your account details accurate and your password secure. Don&apos;t share your credentials with anyone — not even your favourite person from Indirapuram.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Intellectual Property</h2>
          <p>
            All content on this site — designs, text, graphics, logos — belongs to 1SOGA. Don&apos;t copy, reproduce, or resell any of it without our written permission.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Limitation of Liability</h2>
          <p>
            We do our best to keep things running smoothly, but we&apos;re not liable for any indirect or consequential damages arising from your use of this site. We sell tees, not insurance.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--foreground)] sm:text-sm">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site means you accept whatever&apos;s current. We won&apos;t sneak anything weird in — promise.
          </p>
        </div>
      </div>
    </section>
  );
}
