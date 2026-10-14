import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Every route in V0 must be prerendered at build time. If a future change
 * introduces request-time rendering, `next build` fails instead of silently
 * adding a server dependency. Child segments cannot weaken this setting. If a
 * route ever needs request-time rendering (which needs a documented
 * experiment), move this export into a route-group layout that does not wrap
 * that route.
 */
export const ensureStatic = "navigation";

// Fonts are downloaded at build time and served from this site, so visitors'
// browsers never contact a third-party font service.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Clean air not found.`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  // Only shared fields here: Next fills og:title and og:description from each
  // page's own title and description.
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <a
          href="#main"
          className="label-mono sr-only z-50 bg-signal px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
