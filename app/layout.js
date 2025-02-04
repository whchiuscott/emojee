import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "./context/AuthContext";
import Head from "./head";
import Logout from "@/components/Logout";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });
const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EMOJEE🖋️",
  description: "Track how you feel each day, all year round!",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
        <h1 className={"text-base sm:text-lg textGradient " + fugaz.className}>
          EMO記 🖋️ EMOJEE{" "}
        </h1>
      </Link>
      <Link href="/login">
        <Logout />
      </Link>
    </header>
  );
  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={"text-blue-500 text-center " + fugaz.className}>
        Created with 🩵 <br />
        Copyright © Scott Chiu 2025
      </p>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body
          className={
            "w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-sky-950 " +
            opensans.className
          }
        >
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
