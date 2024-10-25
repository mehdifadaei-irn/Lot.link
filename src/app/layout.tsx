import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Handjet, Dosis,Nunito_Sans } from "next/font/google";

import Providers from "@/components/Providers";
import "./globals.css";
import SideBar from "@/components/container/SideBar";
import Header from "@/components/container/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const HandjetFont = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-handjet",
});

export const metadata: Metadata = {
  title: "Lott.Link",
  description: "Lott.link Polygon!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          HandjetFont.variable
        )}
      >
        <Providers>
          <div className="relative flex flex-row max-md:h-[100rem] ">
            <SideBar />
            <div className="flex-1 flex flex-col md:pl-20 w-[70%] font-handjet">
              <Header />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
