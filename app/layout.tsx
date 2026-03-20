import { Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Image from "next/image";
import Navbar from "./components/navbar";
import { AuthWrapper } from "naystack/auth";
import { ApolloWrapperNext } from "naystack/graphql/client";
import { getSEO } from "@/lib/seo";
import { CartProvider } from "@/lib/cart/cart-context";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = localFont({
  src: "../fonts/sans.ttf",
  variable: "--font-body",
});

export const metadata = getSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="SOGA" />
      </head>
      <body
        className={`${bebasNeue.variable} ${sans.variable} antialiased`}
      >
      <AuthWrapper>
        <ApolloWrapperNext>
        <CartProvider>
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
          <Navbar />

          <div className="flex-1">
            {children}
          </div>

          {/* ── Footer ── */}
          <footer className="border-t-2 border-[var(--foreground)] bg-[var(--foreground)] px-4 py-6 sm:px-6 sm:py-8 md:px-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
              <Image src={'/black-transparent-logo.png'} alt={"SOGA"} width={32} height={32} className="invert" />
              <span className="font-[family-name:var(--font-body)] text-[10px] text-white/40 sm:text-xs">
                Soga &mdash; For the people, by the people
              </span>
            </div>
          </footer>
        </div>

        </CartProvider>
        </ApolloWrapperNext>
      </AuthWrapper>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
