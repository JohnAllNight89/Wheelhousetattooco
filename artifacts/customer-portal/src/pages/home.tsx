import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CalendarDays, Zap } from "lucide-react";
import { useListPackages, useListEvents } from "@workspace/api-client-react";
import Footer from "../components/layout/footer";

export default function Home() {
  const { data: packages, isLoading: isLoadingPackages } = useListPackages();
  const { data: events, isLoading: isLoadingEvents } = useListEvents({ upcoming: true });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center overflow-hidden py-24 lg:py-40">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-20" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 mix-blend-overlay" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white/80 backdrop-blur-md">
              <Zap className="mr-2 h-4 w-4 text-primary" />
              The ultimate mobile tattoo experience
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[1.1] text-white">
              Bring the parlor to your <span className="italic text-white/70">event.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              We provide fully-equipped, premium mobile tattoo rigs for festivals, private parties, and corporate events across the southern US.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/inquire">
                <Button size="lg" className="rounded-full px-8 h-14 text-base w-full sm:w-auto bg-white text-black hover:bg-white/90">
                  Request Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 bg-card border-y border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif text-white">Service Packages</h2>
            <p className="text-muted-foreground text-lg">
              Choose the right setup for your event scale and crowd size.
            </p>
          </div>

          {isLoadingPackages ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {packages?.map((pkg) => (
                <div key={pkg.id} className="relative group rounded-2xl border border-white/10 bg-black/40 p-8 hover:bg-white/5 transition-colors flex flex-col h-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif text-white mb-2">{pkg.name}</h3>
                    <p className="text-muted-foreground line-clamp-3">{pkg.description}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm text-muted-foreground">Mobile Rigs</span>
                      <span className="text-white font-medium">{pkg.rigCount}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm text-muted-foreground">Artist Slots</span>
                      <span className="text-white font-medium">{pkg.artistSlots}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-3">Ideal For</span>
                      <div className="flex flex-wrap gap-2">
                        {pkg.idealFor.map((ideal, i) => (
                          <span key={i} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/70">
                            {ideal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {pkg.priceNote && (
                      <p className="text-sm text-muted-foreground mb-6">{pkg.priceNote}</p>
                    )}
                    <Link href={`/inquire?package=${pkg.id}`} className="w-full">
                      <Button variant="outline" className="w-full rounded-full border-white/20 hover:bg-white hover:text-black">
                        Select {pkg.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-white">Catch Us Live</h2>
              <p className="text-muted-foreground text-lg">
                See where the Wheelhouse rigs are rolling next.
              </p>
            </div>
          </div>

          {isLoadingEvents ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <div key={event.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center text-primary mb-4 text-sm font-medium">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.city}, {event.state}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/[0.02]">
              <p className="text-muted-foreground">No upcoming public events scheduled. Be the first to book us!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}