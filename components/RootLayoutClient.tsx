"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Toaster } from "sonner";
import { ModelSettingsProvider } from "@/providers/model-settings-provider";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <a
              href="https://github.com/your-username/aicompare"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Button>
            </a>
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
