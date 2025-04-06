import { AlertTriangle } from "lucide-react";

export function SecurityWarning() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/20 dark:bg-destructive/30 text-destructive dark:text-destructive-foreground text-sm border border-destructive/20">
      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div>
        <span className="font-medium">Security Warning:</span> Do not use this
        application on public or shared computers. Your API keys are stored in
        this browser and could be accessed by others.
      </div>
    </div>
  );
}
