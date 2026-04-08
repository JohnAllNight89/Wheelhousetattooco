import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MapPin, Clock, Mail } from "lucide-react";

export default function Home() {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <div className="bg-noise"></div>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src="/hero-bg.png" 
              alt="Wheelhouse Tattoo Co. Interior" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col items-center text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h2 className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 mb-6">
                Premium Custom Tattooing
              </h2>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-serif text-5xl md:text-7xl lg:text-9xl text-white mb-8 leading-[0.9]"
            >
              WHEELHOUSE <br />
              <span className="text-white/80 italic">TATTOO CO.</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 mt-8"
            >
              <a 
                href="#booking" 
                className="font-mono text-sm uppercase tracking-widest bg-white text-black px-8 py-4 hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#work" 
                className="font-mono text-sm uppercase tracking-widest border border-white/20 text-white px-8 py-4 hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                View Gallery
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
                className="absolute top-0 left-0 w-full h-1/2 bg-white" 
              />
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 md:py-48 bg-background relative z-10">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[3/4] relative z-10 border border-border bg-card p-2">
                  <img src="/flash-1.png" alt="Tattoo Flash" className="w-full h-full object-cover grayscale-[0.5] contrast-125" />
                </div>
                <div className="absolute top-8 -right-8 bottom-8 -left-8 border border-white/10 z-0 hidden md:block" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight">
                  NOT JUST <span className="italic text-muted-foreground">INK.</span><br />
                  A SACRED <span className="italic text-muted-foreground">CRAFT.</span>
                </h2>
                <div className="space-y-6 font-sans text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Wheelhouse Tattoo Co. is an underground sanctuary for serious collectors and first-timers alike. We don't do flash off the rack, and we don't rush the process.
                  </p>
                  <p>
                    Part art gallery, part master craftsman's workshop, our studio is designed to give you space to breathe, think, and collaborate. We believe what you put on your body should be treated with reverence.
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-6">
                  <div className="h-[1px] w-16 bg-white/30"></div>
                  <span className="font-mono text-sm uppercase tracking-widest text-white">Est. 2018</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Artists Section */}
        <section id="artists" className="py-32 bg-black border-y border-border">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
            >
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">The Masters</h3>
                <h2 className="font-serif text-5xl md:text-6xl text-white">RESIDENT <br/><span className="italic">ARTISTS</span></h2>
              </div>
              <p className="max-w-md font-sans text-muted-foreground text-lg">
                Our artists specialize in diverse disciplines, from fine-line minimalism to heavy blackwork. Each brings a distinct voice to the studio.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {[
                { name: "Elias Vance", style: "Heavy Blackwork & Traditional", img: "/artist-1.png", waitlist: "Books closed" },
                { name: "Sarah Chen", style: "Fine-line & Botanical", img: "/artist-2.png", waitlist: "Booking for Oct" }
              ].map((artist, idx) => (
                <motion.div 
                  key={artist.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] relative overflow-hidden mb-6 border border-border">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                      src={artist.img} 
                      alt={artist.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-white/80 transition-colors">{artist.name}</h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{artist.style}</p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-border text-muted-foreground">
                      {artist.waitlist}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery / Work Section */}
        <section id="work" className="py-32 md:py-48 bg-background">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">RECENT <span className="italic text-muted-foreground">WORK</span></h2>
              <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
                A selection of recent pieces from the studio. We focus on contrast, longevity, and placement.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-square relative overflow-hidden border border-border"
              >
                <img src="/work-1.png" alt="Blackwork Tattoo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="aspect-square relative overflow-hidden border border-border md:mt-24"
              >
                <img src="/work-2.png" alt="Fine Line Tattoo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            </div>
            
            <div className="mt-24 text-center">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex font-mono text-sm uppercase tracking-widest border-b border-white pb-2 hover:text-muted-foreground hover:border-muted-foreground transition-colors items-center gap-2"
              >
                View full gallery on Instagram <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-32 bg-card border-y border-border">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="font-serif text-4xl md:text-5xl text-white mb-6"
                >
                  THE <br/><span className="italic text-muted-foreground">PROCESS</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="font-sans text-muted-foreground"
                >
                  We don't do factory-line tattooing. Every piece is a collaboration, built to last a lifetime.
                </motion.p>
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { step: "01", title: "Consultation", desc: "We sit down, review your references, and discuss scale, placement, and flow." },
                  { step: "02", title: "Design", desc: "Your artist creates a custom piece tailored to your anatomy, ensuring it ages beautifully." },
                  { step: "03", title: "Session", desc: "Step into our focused, calm environment. We prioritize your comfort and the craft." },
                  { step: "04", title: "Aftercare", desc: "We provide premium aftercare products and detailed instructions to protect your investment." }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1) }}
                    className="border-l border-border pl-6"
                  >
                    <span className="font-mono text-xs text-muted-foreground mb-4 block">{item.step}</span>
                    <h3 className="font-serif text-2xl text-white mb-3">{item.title}</h3>
                    <p className="font-sans text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking" className="py-32 md:py-48 bg-background">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">
                READY TO <span className="italic text-muted-foreground">COMMIT?</span>
              </h2>
              <p className="font-sans text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Fill out our booking request form with your ideas, placement, and preferred artist. We'll review your request and get back to you within 3-5 days.
              </p>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-12">
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground ml-2">Name</label>
                  <input type="text" className="w-full bg-transparent border border-border p-4 text-white focus:outline-none focus:border-white transition-colors font-sans" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground ml-2">Email</label>
                  <input type="email" className="w-full bg-transparent border border-border p-4 text-white focus:outline-none focus:border-white transition-colors font-sans" placeholder="john@example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground ml-2">Artist Preference</label>
                  <select className="w-full bg-transparent border border-border p-4 text-white focus:outline-none focus:border-white transition-colors font-sans appearance-none rounded-none">
                    <option className="bg-black">No Preference</option>
                    <option className="bg-black">Elias Vance</option>
                    <option className="bg-black">Sarah Chen</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground ml-2">Idea & Placement</label>
                  <textarea rows={4} className="w-full bg-transparent border border-border p-4 text-white focus:outline-none focus:border-white transition-colors font-sans resize-none" placeholder="Describe what you want to get and where..."></textarea>
                </div>
                
                <div className="md:col-span-2 mt-4 text-center">
                  <button type="button" className="font-mono text-sm uppercase tracking-widest bg-white text-black px-12 py-4 hover:bg-white/90 transition-colors w-full sm:w-auto">
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-32 bg-black border-t border-border">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-12">
                  FIND <span className="italic text-muted-foreground">US</span>
                </h2>
                
                <div className="space-y-8 font-sans">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-white shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-serif text-xl mb-1">The Studio</h4>
                      <p className="text-muted-foreground">
                        1248 Underground Alley<br />
                        Arts District, NY 10012
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-white shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-serif text-xl mb-1">Hours</h4>
                      <p className="text-muted-foreground">
                        Tuesday - Saturday: 12PM - 8PM<br />
                        Sunday - Monday: Closed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-white shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-serif text-xl mb-1">Contact</h4>
                      <p className="text-muted-foreground">
                        booking@wheelhousetattooco.com<br />
                        +1 (555) 019-8472
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="order-1 lg:order-2 aspect-[4/3] border border-border p-2 bg-card relative"
              >
                <img src="/exterior.png" alt="Studio Exterior" className="w-full h-full object-cover grayscale-[0.8]" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
