export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 bg-card mt-auto">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="font-serif text-lg text-foreground mb-4">Wheelhouse Tattoo Co.</p>
        <p className="text-sm">© {new Date().getFullYear()} Wheelhouse. All rights reserved.</p>
      </div>
    </footer>
  );
}
