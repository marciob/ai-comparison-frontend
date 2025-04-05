"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Settings } from "lucide-react";
import { ApiKeysManager } from "./api-keys-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription } from "./card";
import { ModelSettings } from "./model-settings";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <Tabs defaultValue="api-keys" className="w-full flex">
          <div className="border-r min-h-[450px]">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <TabsList className="flex flex-col h-full justify-start items-stretch p-2 bg-transparent space-y-1">
              <TabsTrigger
                value="api-keys"
                className="justify-start px-4 py-2 w-40 data-[state=active]:bg-muted"
              >
                API Keys
              </TabsTrigger>
              <TabsTrigger
                value="models"
                className="justify-start px-4 py-2 w-40 data-[state=active]:bg-muted"
              >
                Models
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="justify-start px-4 py-2 w-40 data-[state=active]:bg-muted"
              >
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="justify-start px-4 py-2 w-40 data-[state=active]:bg-muted"
              >
                About
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 px-6 py-6">
            <TabsContent value="api-keys" className="mt-0 border-0">
              <ApiKeysManager />
            </TabsContent>
            <TabsContent value="models" className="mt-0 border-0">
              <ModelSettings />
            </TabsContent>
            <TabsContent value="preferences" className="mt-0 border-0">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <CardDescription>
                    Customize your experience with these preferences.
                  </CardDescription>
                  {/* Add preference settings here */}
                  <div className="text-sm text-muted-foreground">
                    More preferences coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="about" className="mt-0 border-0">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <CardDescription>AI Model Comparison Tool</CardDescription>
                  <div className="text-sm space-y-2">
                    <p>Version: 1.0.0</p>
                    <p>
                      A tool for comparing responses from different AI models.
                    </p>
                    <p className="text-muted-foreground">
                      Built with Next.js, Tailwind CSS, and shadcn/ui.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
