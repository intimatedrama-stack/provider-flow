import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Provider Flow",
  description: "Your complete provider management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
