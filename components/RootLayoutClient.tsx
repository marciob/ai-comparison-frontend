"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Toaster } from "sonner";
import { ModelSettingsProvider } from "@/providers/model-settings-provider";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ModelSettingsProvider>
        <div className="relative">
          <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
            <SettingsDialog />
            <ThemeToggle />
          </div>
          {children}
        </div>
        <Toaster richColors closeButton position="top-center" />
      </ModelSettingsProvider>
    </ThemeProvider>
  );
}
