import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MapPin, Calendar, Users, Truck, Sparkles, Crosshair, Droplet, Shield, Zap } from "lucide-react";
import { useListPackages, useListEvents } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Home() {
  const containerRef = useRef(null);
  
  const { data: packages = [], isLoading: packagesLoading } = useListPackages();
  const { data: events = [], isLoading: eventsLoading } = useListEvents({ upcoming: true });

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <div className="bg-noise"></div>
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/70 z-10" />
            <img 
              src="/hero-banner.png" 
              alt="Wheelhouse Tattoo Co. Mobile Studio" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col items-center text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h2 className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-primary mb-6 font-bold">
                The Mobile Tattoo Fleet
              </h2>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-serif text-6xl md:text-8xl lg:text-[10rem] text-white mb-6 leading-[0.85] uppercase tracking-tighter"
            >
              Ink Meets <br />
              <span className="text-white/70 italic tracking-normal">The Road.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-2xl text-lg md:text-xl text-muted-foreground font-sans mt-6"
            >
              Operating across TN, TX, AZ, OK, and FL. We bring a full-scale, premium tattoo studio directly to your festival, wedding, or brand activation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 mt-12"
            >
              <a 
                href="/customer/" 
                className="font-mono text-sm uppercase tracking-widest bg-primary text-primary-foreground px-10 py-5 hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 font-bold"
              >
                Book The Fleet
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#tour" 
                className="font-mono text-sm uppercase tracking-widest border border-white/20 text-white px-10 py-5 hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                View Tour Dates
              </a>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
            <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
              <motion.div 
                animate={{ y: [0, 48] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-primary" 
              />
            </div>
          </motion.div>
        </section>

        {/* 2. Manifesto Section */}
        <section id="manifesto" className="py-32 md:py-48 bg-background relative z-10 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/5] relative z-10 border border-border bg-card p-2">
                  <img src="/rig-exterior.png" alt="Tattoo Rig Exterior" className="w-full h-full object-cover grayscale-[0.3] contrast-125" />
                </div>
                <div className="absolute top-12 -right-12 bottom-12 -left-12 border border-primary/20 z-0 hidden md:block" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">The Manifesto</h3>
                <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight uppercase">
                  Not a shop. <br />
                  <span className="italic text-muted-foreground tracking-normal">An Experience.</span>
                </h2>
                <div className="space-y-6 font-sans text-lg text-muted-foreground leading-relaxed">
                  <p>
                    The tattoo industry has been static for decades. You go to a shop, you wait in a lobby, you get tattooed. We decided to rip the studio out of the strip mall and put it on wheels.
                  </p>
                  <p>
                    Wheelhouse Tattoo Co. is a fleet of custom-built Airstreams and mobile rigs engineered to be premium, sterile, high-end tattoo environments. We deploy to music festivals, bachelorette weekends, corporate brand activations, and private events.
                  </p>
                  <p>
                    Wherever the energy is, we bring the ink.
                  </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-8">
                  <div>
                    <Truck className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-serif text-2xl text-white mb-2">3 Rigs</h4>
                    <p className="font-sans text-sm text-muted-foreground">Custom-built mobile studios ready to deploy.</p>
                  </div>
                  <div>
                    <MapPin className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-serif text-2xl text-white mb-2">5 States</h4>
                    <p className="font-sans text-sm text-muted-foreground">Operating across TN, TX, AZ, OK, and FL.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. The Setup / Standards */}
        <section className="py-24 bg-card border-y border-border overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-white mb-4 uppercase">Hospital Grade</h3>
                <p className="font-sans text-muted-foreground">Every rig meets or exceeds health department standards. Autoclaves, single-use setups, and pristine environments.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-white mb-4 uppercase">Self-Sufficient</h3>
                <p className="font-sans text-muted-foreground">Solar panels, generator backups, and onboard water. We don't need your power or plumbing to operate.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Droplet className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-white mb-4 uppercase">Elite Artists</h3>
                <p className="font-sans text-muted-foreground">We curate top-tier talent for every activation. Clean lines, heavy blackwork, and perfect saturation.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Packages Section */}
        <section id="packages" className="py-32 md:py-48 bg-background relative">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">How It Works</h3>
              <h2 className="font-serif text-5xl md:text-6xl text-white uppercase">Deploy The Fleet</h2>
              <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto mt-6">From massive music festivals to intimate private parties, we scale to match the energy of your event.</p>
            </motion.div>

            {packagesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 bg-border/50 animate-pulse border border-border"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {packages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    className="border border-border bg-card/30 p-8 hover:border-primary transition-colors flex flex-col h-full relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Truck className="w-24 h-24 text-white" />
                    </div>
                    <div className="mb-8 relative z-10">
                      <span className="font-mono text-sm uppercase tracking-widest text-primary border border-primary/30 px-3 py-1 mb-6 inline-block">
                        Package {pkg.id}
                      </span>
                      <h3 className="font-serif text-3xl text-white mb-4 uppercase">{pkg.name}</h3>
                      <p className="font-sans text-muted-foreground h-20">{pkg.description}</p>
                    </div>

                    <div className="space-y-4 mb-10 flex-grow relative z-10">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-sans text-white text-sm">{pkg.rigCount} {pkg.rigCount === 1 ? 'Rig' : 'Rigs'} Deployed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-sans text-white text-sm">Up to {pkg.artistSlots} Artists</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-sans text-white text-sm">Ideal for: {pkg.idealFor.join(", ")}</span>
                      </div>
                    </div>

                    {pkg.priceNote && (
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 text-center border-t border-border pt-6 relative z-10">
                        {pkg.priceNote}
                      </p>
                    )}

                    <a 
                      href={`/customer/?package=${pkg.id}`}
                      className="font-mono text-sm uppercase tracking-widest border border-primary text-primary px-8 py-4 text-center hover:bg-primary hover:text-primary-foreground transition-colors w-full mt-auto block relative z-10 font-bold"
                    >
                      Inquire Now
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Gallery / Vibe Section */}
        <section className="py-32 bg-black border-y border-border">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-square relative overflow-hidden border border-border"
              >
                <img src="/artist-portrait.png" alt="Artist at Work" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </motion.div>
              <div className="flex flex-col gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="aspect-video relative overflow-hidden border border-border"
                >
                  <img src="/event-atmosphere.png" alt="Event Atmosphere" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="aspect-video relative overflow-hidden border border-border bg-card p-12 flex flex-col justify-center"
                >
                  <h3 className="font-serif text-3xl text-white mb-4 uppercase">Zero Compromise</h3>
                  <p className="font-sans text-muted-foreground">Every session in the rig feels identical to walking into a high-end private studio. The music, the lighting, the cleanliness. You forget you're standing in the middle of a 40,000 person festival.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Tour / Events Section */}
        <section id="tour" className="py-32 bg-card relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
            >
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Where We're At</h3>
                <h2 className="font-serif text-5xl md:text-6xl text-white uppercase">Upcoming <br/><span className="italic tracking-normal text-muted-foreground">Tour Dates</span></h2>
              </div>
              <p className="max-w-md font-sans text-muted-foreground text-lg">
                Catch the fleet at a public event near you. Walk-ups welcome, or pre-book a slot to guarantee your spot.
              </p>
            </motion.div>

            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-border/30 animate-pulse border border-border"></div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="border border-border p-12 text-center bg-background">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-serif text-2xl text-white mb-2 uppercase">No Public Events Scheduled</h3>
                <p className="font-sans text-muted-foreground mb-6">The fleet is currently booked for private events. Check back soon.</p>
                <a href="/customer/" className="font-mono text-sm uppercase tracking-widest text-primary hover:text-white transition-colors underline underline-offset-4">
                  Book us for your own event
                </a>
              </div>
            ) : (
              <div className="flex flex-col border border-border bg-background">
                {events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 hover:bg-card transition-colors ${
                      idx !== events.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-6 md:mb-0">
                      <div className="min-w-32 border-l-2 border-primary pl-4">
                        <span className="font-mono text-xl text-white block">{format(new Date(event.eventDate), 'MMM dd')}</span>
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{format(new Date(event.eventDate), 'yyyy')}</span>
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl text-white mb-2 uppercase">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.city}, {event.state}</span>
                          {event.venue && <span className="hidden md:inline">• {event.venue}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="text-left md:text-right">
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-1">Status</span>
                        <span className={`font-mono text-sm uppercase tracking-widest ${event.status === 'open' ? 'text-green-500' : 'text-primary'}`}>
                          {event.status}
                        </span>
                      </div>
                      <button className="font-mono text-xs uppercase tracking-widest border border-border px-6 py-3 hover:bg-white hover:text-black transition-colors w-full md:w-auto">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 7. Call to Artists */}
        <section className="py-32 md:py-48 bg-primary relative overflow-hidden border-t border-border">
          <div className="absolute inset-0 mix-blend-overlay opacity-20">
            <img src="/artist-portrait.png" alt="Tattoo Artist" className="w-full h-full object-cover grayscale" />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
            <Crosshair className="w-16 h-16 text-white mx-auto mb-8 opacity-80" />
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 uppercase">
              Join The Fleet
            </h2>
            <p className="font-sans text-xl text-white/90 mb-12">
              We're always looking for top-tier guest artists to join us on the road. If you produce exceptional work and want to tattoo at major festivals and private events, apply to our roster.
            </p>
            <a 
              href="/artist/" 
              className="inline-flex font-mono text-sm uppercase tracking-widest bg-black text-white px-12 py-5 hover:bg-white hover:text-black transition-colors items-center gap-3 font-bold"
            >
              Apply as Guest Artist
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
