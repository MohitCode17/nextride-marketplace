import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextRide - AI Car Marketplace",
  description:
    "Discover your next ride with AI-driven car recommendations and unbeatable deals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-blue-100 py-12">
          <div className="container mx-auto text-center text-gray-700 px-4">
            <p>Made with ❤️ by MohitCodes</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
