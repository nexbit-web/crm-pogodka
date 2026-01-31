import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CRM-Pogodka",
  description: "Панель управления Pogodka",
  icons: {
    icon: "/CRM-logo.png",           
    shortcut: "/favicon-16x16.png", 
    apple: "/apple-touch-icon.png", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster />
        <NextTopLoader
          color="var(--primary)"
          height={4}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
