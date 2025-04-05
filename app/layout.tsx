import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SettingsDialog } from "@/components/ui/settings-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Compare",
  description: "Compare responses from different AI models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative">
            <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
              <SettingsDialog />
              <ThemeToggle />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
