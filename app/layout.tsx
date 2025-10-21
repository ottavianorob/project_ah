import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pose-Only AR Helper",
  description: "An augmented reality helper to align your camera view with a historical photo overlay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <div className="min-h-screen text-gray-100 font-sans">
          <header className="bg-gray-800 p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-teal-400 hover:text-teal-300">
                Pose-Only AR Helper
              </Link>
              <Link href="/overlays" className="text-lg text-gray-300 hover:text-white">
                Overlays
              </Link>
            </nav>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
