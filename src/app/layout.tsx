import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { ReduxProvider } from "@/redux/provider";

const roboto = Roboto({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: "Weather App",
  description: "Next.js weather App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
