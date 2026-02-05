import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Uessler OS",
  description: "Uessler OS",
  openGraph: {
    title: "Uessler OS",
    description: "Gustavo Uessler OS",
    url: "https://uessler.com",
    siteName: "Uessler OS",
    images: [
      {
        url: `/Ufavicon.png`,
        width: 819,
        height: 816,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uessler OS",
    description: "Gustavo Uessler OS",
    images: [`/Ufavicon.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/digital-7-mono" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/monograf" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/overtime-lcd" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/ds-digital" rel="stylesheet" />
      </head>
      <body
        className={`${ibmPlexSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
