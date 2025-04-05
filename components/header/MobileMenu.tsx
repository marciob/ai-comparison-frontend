import { Menu, X, Github, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface MobileMenuProps {
  className?: string;
}

export function MobileMenu({ className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative sm:hidden", className)}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-[200px] rounded-md border bg-popover text-popover-foreground shadow-md z-50"
        >
          <div className="py-1">
            <a
              href="/settings"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent"
            >
              <Settings2 className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </a>
            <div className="flex items-center gap-3 px-4 py-2.5">
              <div className="h-4 w-4 flex items-center justify-center opacity-70">
                🌗
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">Theme</span>
              </div>
              <ThemeToggle />
            </div>
            <div className="h-px bg-border my-1" />
            <a
              href="https://github.com/m/aicompare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
