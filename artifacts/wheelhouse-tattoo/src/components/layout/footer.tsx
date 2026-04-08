import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-black py-24 border-t border-border relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">Wheelhouse Tattoo Co.</h2>
            <p className="text-muted-foreground max-w-sm font-sans text-lg mb-8">
              A premium studio for those who treat their skin like a gallery wall. Walk-ins welcome, appointments preferred.
            </p>
          </div>
          
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-white mb-6">Studio</h3>
            <ul className="space-y-4 font-sans text-muted-foreground">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#artists" className="hover:text-white transition-colors">Artists</a></li>
              <li><a href="#work" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Booking</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-white mb-6">Connect</h3>
            <ul className="space-y-4 font-sans text-muted-foreground">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Wheelhouse Tattoo Co.
          </p>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            wheelhousetattooco.com
          </p>
        </div>
      </div>
    </footer>
  );
}
