import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl tracking-tight font-medium hidden sm:inline-block">
              Wheelhouse
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/inquire">
            <Button size="sm" className="rounded-full font-medium">
              Book the Fleet
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
