import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Snarkmark",
  description: "Track the knowledge you consume",
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
