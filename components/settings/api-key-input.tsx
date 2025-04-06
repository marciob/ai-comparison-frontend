import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface ApiKeyInputProps {
  provider: {
    id: string;
    name: string;
  };
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ provider, value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <input
          type={showKey ? "text" : "password"}
          id={`${provider.id}-key`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your ${provider.name} API key`}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 bg-background"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowKey(!showKey)}
        className="flex-shrink-0"
      >
        {showKey ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
