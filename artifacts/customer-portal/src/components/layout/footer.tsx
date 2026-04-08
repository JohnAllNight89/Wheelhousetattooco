import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif text-xl font-bold tracking-tight text-white mb-2">
            Wheelhouse Tattoo Co.
          </span>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Elevating events with premium mobile tattoo experiences.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/inquire" className="hover:text-white transition-colors">
            Book an Event
          </Link>
          <a href="#" className="hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}