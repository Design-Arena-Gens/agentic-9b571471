import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Fetcher",
  description: "Fetches and displays the current time every five minutes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
