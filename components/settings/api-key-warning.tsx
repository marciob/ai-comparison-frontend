import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApiKeysManager } from "@/components/settings/api-keys-manager";

export function ApiKeyWarning() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-muted-foreground/20 max-w-2xl mx-auto">
      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Welcome to AI Compare!</p>
        <p className="text-sm text-muted-foreground">
          To get started, you'll need to add your API keys in the settings. This
          will allow you to compare responses from different AI models.
        </p>
        <p className="text-sm text-muted-foreground">
          Please{" "}
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-primary hover:text-primary/80 transition-colors">
                go to settings
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>API Keys</DialogTitle>
              </DialogHeader>
              <ApiKeysManager />
            </DialogContent>
          </Dialog>{" "}
          to add your API keys.
        </p>
      </div>
    </div>
  );
}
