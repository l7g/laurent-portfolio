import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/react";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import StructuredData from "@/components/structured-data";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Software Development",
    "Portfolio",
    "JavaScript",
    "Node.js",
    "Prisma",
    "PostgreSQL",
    "Laurent Gagne",
    "Software Engineer",
    "Web Developer",
    "Frontend",
    "Backend",
  ],
  authors: [{ name: "Laurent Gagne", url: process.env.NEXT_PUBLIC_APP_URL }],
  creator: "Laurent Gagne",
  publisher: "Laurent Gagne",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://laurentgagne.com",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
        suppressHydrationWarning
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="w-full bg-default-100 py-12 mt-20">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">
                      Laurent&apos;s Portfolio
                    </h3>
                    <p className="text-default-600 text-sm">
                      Full-stack developer crafting modern software solutions
                      with passion for clean code and innovative solutions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <div className="space-y-2">
                      <Link
                        className="text-sm text-default-600 hover:text-primary block"
                        href="#about"
                      >
                        About
                      </Link>
                      <Link
                        className="text-sm text-default-600 hover:text-primary block"
                        href="#projects"
                      >
                        Projects
                      </Link>
                      <Link
                        className="text-sm text-default-600 hover:text-primary block"
                        href="#skills"
                      >
                        Skills
                      </Link>
                      <Link
                        className="text-sm text-default-600 hover:text-primary block"
                        href="/contact"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Connect</h4>
                    <div className="flex gap-4">
                      <Link
                        isExternal
                        className="text-default-600 hover:text-primary"
                        href={siteConfig.links.github}
                      >
                        GitHub
                      </Link>
                      <Link
                        isExternal
                        className="text-default-600 hover:text-primary"
                        href={siteConfig.links.linkedin}
                      >
                        LinkedIn
                      </Link>
                      <Link
                        className="text-default-600 hover:text-primary"
                        href={siteConfig.links.email}
                      >
                        Email
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="border-t border-default-200 mt-8 pt-8 text-center">
                  <p className="text-sm text-default-600">
                    © 2025 Laurent&apos;s Portfolio. Built with Next.js
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
