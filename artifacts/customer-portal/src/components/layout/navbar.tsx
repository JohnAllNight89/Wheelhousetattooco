import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logo from "@assets/grok_image_1775622274401_1775622404806.jpg";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group">
            <img src={logo} alt="Wheelhouse Tattoo Co." className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" style={{ mixBlendMode: "screen" }} />
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
