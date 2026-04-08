import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@assets/grok_image_1775622274401_1775622404806.jpg";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Manifesto", href: "#manifesto" },
    { name: "The Fleet", href: "#fleet" },
    { name: "Experiences", href: "#packages" },
    { name: "Tour Dates", href: "#tour" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-border py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src={logo} alt="Wheelhouse Tattoo Co." className="h-12 w-12 object-contain" style={{ mixBlendMode: "screen" }} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="/artist/"
            className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
          >
            Artist Signup
          </a>
          <a
            href="/customer/"
            className="text-sm font-mono uppercase tracking-widest bg-primary text-primary-foreground px-6 py-2 hover:bg-primary/90 transition-colors"
          >
            Book Fleet
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border py-6 px-6 flex flex-col gap-6 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="/artist/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
          >
            Artist Signup
          </a>
          <a
            href="/customer/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-center text-lg font-mono uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors"
          >
            Book Fleet
          </a>
        </div>
      )}
    </header>
  );
}
