import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

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
    "Web Development",
    "Portfolio",
    "JavaScript",
    "Node.js",
    "Prisma",
    "PostgreSQL",
  ],
  authors: [{ name: "Laurent" }],
  creator: "Laurent",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.ico",
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
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
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
                      Full-stack developer crafting modern web applications with
                      passion for clean code and innovative solutions.
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
                        href="#contact"
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
                    © 2025 Laurent&apos;s Portfolio. Built with{" "}
                    <span className="text-primary">HeroUI</span> and Next.js
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
