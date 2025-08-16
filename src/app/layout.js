import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextRide - Smart Marketplace for Bikes, Scooters & EVs",
  description:
    "Let AI help you find the perfect ride—whether it's a bike, scooter, or electric vehicle. Fast, smart, and easy.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster />
          <footer className="bg-white border-t py-6">
            <div className="container mx-auto text-center text-gray-600 px-4 text-sm">
              <p>
                Made with <span className="text-pink-500">❤️</span> by{" "}
                <span className="text-teal-600 font-semibold">Mohit Gupta</span>
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
