import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { TRPCProvider } from "@/components/providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoFetch Auto | Your Personal Car Buying Advocate",
  description:
    "GoFetch Auto is the professional representation that's been missing from the second-biggest purchase of your life. We find your car, negotiate the deal, and handle the dealership — so you get the keys without the dread.",
  openGraph: {
    title: "GoFetch Auto | What If Buying a Car Actually Felt Good?",
    description: "Professional car buying advocacy. We negotiate, you save. $3,400 average savings.",
    url: "https://gofetchauto.com",
    siteName: "GoFetch Auto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoFetch Auto | Car Buying Advocacy",
    description: "Professional car buying advocacy. We negotiate, you save.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F6K8C4RVYZ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-F6K8C4RVYZ');`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `:root { --font-display: 'Instrument Serif', serif; }` }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-navy">
        <TRPCProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
