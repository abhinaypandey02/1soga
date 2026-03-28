import Image from "next/image";
import Link from "next/link";
import products from "@/data/products";
import { Product } from "@/data/types";
import StaggerReveal from "./components/stagger-reveal";
import DeclareCTA from "./components/declare-cta";
// import { getSEO } from "@/lib/seo";

// export const metadata = getSEO();

function getPriceDisplay(product: Product): string {
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `₹${min.toFixed(2)}`;
  return `from ₹${min.toFixed(2)}`;
}

const MARQUEE_TEXT = 'ONE PEOPLE \u2022 ONE SOGA \u2022 NOIDA TO GURGAON, ALL SOGA \u2022 SOBO IS MID \u2022 FARIDABAD IS SOGA \u2022 WE ARE ALL SOGA \u2022 ';

export default function Home() {
  return (
    <>
      {/* \u2500\u2500 Hero Section \u2500\u2500 */}
      <section className="noise-overlay relative overflow-hidden bg-[var(--surface)] px-4 pb-10 pt-10 sm:px-6 sm:pb-16 sm:pt-16 md:px-12 md:pb-20 md:pt-24">


        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Oversized decorative quote marks \u2014 hidden on mobile to save space */}
          <span
            className="pointer-events-none absolute -left-4 -top-8 hidden font-[family-name:var(--font-display)] text-[12rem] leading-none text-[var(--accent)] opacity-10 sm:block md:-left-8 md:-top-12 md:text-[20rem]"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <div className="relative">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 sm:mb-6">
              <div className="h-[3px] w-8 bg-[var(--accent)] sm:w-10" />
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
                The Movement Has Begun
              </span>
            </div>

            {/* Main Headline \u2014 single line on mobile, two lines on sm+ */}
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(6rem,40vw,13rem)] sm:text-[clamp(6rem,25vw,13rem)] uppercase leading-[0.82] tracking-tight text-[var(--foreground)]">
              <span className="inline">ONE</span>
              <br />
              <span className="relative inline-block text-[var(--accent)]">
                SOGA
                <svg className="absolute -bottom-1 left-0 w-full sm:-bottom-2 md:-bottom-3" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 8C50 2 100 4 150 6C200 8 250 3 298 7" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Manifesto line */}
            <p className="mt-6 max-w-lg font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--muted)] sm:mt-8 sm:text-base md:text-lg">
              SoBo had its moment. SoDe had its run. Soga is forever.
              <br />
              The alpine views start at Indirapuram. The NCR just didn&apos;t have a name for it yet.
            </p>

            {/* CTA */}
          </div>
        </div>

        {/* Decorative accent block \u2014 visible on mobile as a smaller corner mark */}
        <Image className="absolute opacity-10 top-0 right-0 h-16 w-16 bg-[var(--accent)] sm:h-24 sm:w-24 md:h-40 md:w-40 lg:h-56 lg:w-56" src={'/white-orange-logo.png'} alt={'SOGA'}  aria-hidden="true" height={56*4} width={56*4}/>
      </section>

      {/* \u2500\u2500 Marquee Ticker \u2500\u2500 */}
      <div className="overflow-hidden border-y-2 border-[var(--foreground)] bg-[var(--foreground)] py-2.5 sm:py-3">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="mx-0 font-[family-name:var(--font-display)] text-lg tracking-wider text-white sm:text-xl md:text-2xl"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* \u2500\u2500 Product Grid \u2500\u2500 */}
      <section id="drops" className="mx-auto max-w-7xl px-4 py-5 my-5 sm:px-6 sm:py-8 sm:my-8 md:px-12 md:py-10 md:my-10">
        <StaggerReveal>
          <div className="mb-6 flex items-end justify-between sm:mb-12">
            <div>
            <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
              Official Gear
            </span>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--foreground)] sm:mt-2 sm:text-5xl md:text-6xl">
                THE DROPS
              </h2>
            </div>
            <span className="hidden font-[family-name:var(--font-body)] text-sm text-[var(--muted)] md:inline">
            {products.length} items
          </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}/${product.variants[0].slug}`}
                className="product-card stagger-item group border-2 border-[var(--border)] bg-[var(--surface)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={product.variants[0].image}
                    alt={product.name}
                    fill
                    className="product-image object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--foreground)]/0 transition-all duration-300 group-hover:bg-[var(--foreground)]/60">
                  <span className="translate-y-4 font-[family-name:var(--font-body)] text-sm font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Get This
                  </span>
                  </div>
                </div>

                {/* Info */}
                <div className="border-t-2 border-[var(--border)] p-3.5 transition-colors group-hover:border-[var(--accent)] sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wide text-[var(--foreground)] sm:text-sm">
                      {product.name}
                    </h3>
                    <span className="shrink-0 font-[family-name:var(--font-display)] text-lg text-[var(--accent)] sm:text-xl">
                    {getPriceDisplay(product)}
                  </span>
                  </div>
                  {(() => {
                    const unique = new Set(product.variants.map(v =>
                      v.options.filter(o => o.type !== "Size").map(o => o.value).join("-")
                    ));
                    return unique.size > 1 && (
                      <span className="mt-1.5 inline-block font-[family-name:var(--font-body)] text-[10px] uppercase tracking-wider text-[var(--muted)] sm:mt-2 sm:text-[11px]">
                        {unique.size} options
                      </span>
                    );
                  })()}
                </div>
              </Link>
            ))}
          </div>
        </StaggerReveal>
      </section>

      {/* \u2500\u2500 Community CTA Banner \u2500\u2500 */}
      <section className="halftone-overlay noise-overlay relative overflow-hidden bg-[var(--accent)] px-4 py-16 text-center sm:px-6 sm:py-20 md:py-28">
        <div className="relative z-10">
          <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60 sm:text-xs">
            From Indirapuram to Cyber City, all one
          </span>
          <h2 className="mx-auto mt-3 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.5rem,12vw,8rem)] uppercase leading-[0.85] tracking-tight text-white sm:mt-4">
            THE NCR IS
            <br />
            ONE SOGA
          </h2>
          <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-body)] text-sm text-white/70 sm:mt-6 sm:text-base md:text-lg">
            Gurgaon&apos;s ambition. Noida&apos;s skyline. Faridabad&apos;s grit. Vaishali&apos;s charm.
            SoBo&apos;s insecurity. One movement — effortlessly extraordinary.
          </p>
          <div className="mt-8 sm:mt-10">
            <DeclareCTA />
          </div>
        </div>

        {/* Oversized decorative text */}
        <span
          className="pointer-events-none absolute -bottom-6 right-0 font-[family-name:var(--font-display)] text-[12rem] uppercase leading-none text-white opacity-[0.06] sm:-bottom-10 sm:text-[20rem] md:text-[30rem]"
          aria-hidden="true"
        >
          ONE
        </span>
      </section>
    </>
  );
}
