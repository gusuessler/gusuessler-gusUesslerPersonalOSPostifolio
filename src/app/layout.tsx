import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Uessler.com",
  description: "Portfolio operating system",
  icons: {
    icon: `${basePath}/icon.png`,
    shortcut: `${basePath}/icon.png`,
    apple: `${basePath}/icon.png`,
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
