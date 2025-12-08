import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Snarkmark",
  description: "Social networking for academics. Keep a diary of the papers you read, rate them, review them, and discover new research.",
  metadataBase: new URL("https://snarkmark.netlify.app"),
  openGraph: {
    title: "Snarkmark",
    description: "Social networking for academics. Keep a diary of the papers you read, rate them, review them, and discover new research.",
    url: "https://snarkmark.netlify.app",
    siteName: "Snarkmark",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Snarkmark - Engage with the texts you read",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snarkmark",
    description: "Social networking for academics. Keep a diary of the papers you read, rate them, review them, and discover new research.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#14181c] font-serif text-slate-200">
        <Providers>
          <Navigation />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
