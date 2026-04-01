import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { TRPCProvider } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoFetch Auto | Professional Car Buying Advocacy",
  description:
    "Dealerships train to take your money. GoFetch Auto trains to stop them. Professional car buying advocacy — $3,400 avg savings.",
  openGraph: {
    title: "GoFetch Auto | Dealerships Train to Take Your Money. We Train to Stop Them.",
    description: "Professional car buying advocacy. We negotiate, you save. $3,400 average savings.",
    url: "https://gofetchauto.com",
    siteName: "GoFetch Auto",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F6K8C4RVYZ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-F6K8C4RVYZ');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a1628] text-[#faf6ef]">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
