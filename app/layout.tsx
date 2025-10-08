import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // you can adjust weights
});

// Optional metadata
export const metadata: Metadata = {
  title: "To-Do App",
  description: "A modern to-do app with dark/light mode and task management features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500`}
      >
        {children}
      </body>
    </html>
  );
}
