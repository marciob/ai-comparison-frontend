"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ApiKeysManager } from "./api-keys-manager";
import { ModelSettings } from "./model-settings";
import { useModelSettings } from "@/providers/model-settings-provider";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

export function SettingsDialog() {
  const { setModelSettings } = useModelSettings();
  const [activeTab, setActiveTab] = useState("api-keys");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="api-keys" className="mt-4">
            <ApiKeysManager />
          </TabsContent>
          <TabsContent value="models" className="mt-4">
            <ModelSettings onModelChange={setModelSettings} />
          </TabsContent>
          <TabsContent value="about" className="mt-4">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <CardDescription>AI Model Comparison Tool</CardDescription>
                <div className="text-sm space-y-2">
                  <p>Version: 1.0.0</p>
                  <p>
                    A tool for comparing responses from different AI models.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
