import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/providers";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Quiz",
  description:
    "Quiz pour évaluer vos connaissances en programmation, réseau, cybersécurité, bases de données, DevOps et IA.",
};

// Appliqué avant l'affichage pour éviter un flash de thème clair en mode sombre.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Backdrop />
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}

// Halo de couleurs flou en arrière-plan, commun à toutes les pages.
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-600/20" />
      <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-700/15" />
      <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-700/15" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
    </div>
  );
}
