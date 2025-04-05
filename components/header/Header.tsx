import Image from "next/image";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="w-full px-4 pt-4 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src="/aicomparison_logo.jpg"
          alt="AI Comparison Logo"
          width={40}
          height={40}
          className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
        />
        <h1 className="text-xl sm:text-2xl font-bold">AI Model Comparison</h1>
      </div>
      <MobileMenu />
    </header>
  );
}
