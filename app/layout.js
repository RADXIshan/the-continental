import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "The Continental — Timeless Luxury Awaits",
  description:
    "Experience unparalleled elegance at The Continental. A sanctuary where heritage meets modern refinement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
