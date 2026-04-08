import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, Clock } from "lucide-react";
import Footer from "../components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
          <div 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center grayscale" 
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[1.1]">
              Your vision, <br />
              <span className="text-muted-foreground italic">expertly crafted.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
              Connect with world-class tattoo artists. Browse portfolios, find your perfect match, and book your next masterpiece with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/browse">
                <Button size="lg" className="rounded-full px-8 h-14 text-base w-full sm:w-auto">
                  Find an Artist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif">Curated Talent</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every artist on Wheelhouse is vetted for quality, professionalism, and distinct style.
              </p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif">Local & Global</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find artists in your city or discover talent worth traveling for.
              </p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif">Seamless Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Secure your spot instantly with our streamlined booking and communication platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
