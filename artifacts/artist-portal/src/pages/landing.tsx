import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl leading-none">W</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Wheelhouse</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            Apply as Artist
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Tattoo studio at night" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-primary/20 bg-primary/10 text-primary mb-8">
            Artist Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Your craft.<br/>Your rules.<br/>
            <span className="text-primary font-serif italic">Your studio.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A focused workspace for professional tattoo artists to manage their brand, streamline bookings, and focus on what matters most — the art.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/sign-up" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 py-2 text-lg">
              Get Started
            </Link>
            <Link href="/sign-in" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 py-2 text-lg">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 bg-card border-t border-border mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Booking Management</h3>
                <p className="text-muted-foreground">Keep your schedule organized. Review, confirm, and manage client bookings all in one place.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Professional Profile</h3>
                <p className="text-muted-foreground">Showcase your portfolio, define your styles, and set your own rates. Your brand, front and center.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Service Offerings</h3>
                <p className="text-muted-foreground">Create custom service packages. Flash, custom pieces, consultations — set the duration and price.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}