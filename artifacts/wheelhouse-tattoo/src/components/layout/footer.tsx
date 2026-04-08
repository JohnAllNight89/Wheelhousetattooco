import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-black py-24 border-t border-border relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 uppercase">Wheelhouse Tattoo Co.</h2>
            <p className="text-muted-foreground max-w-sm font-sans text-lg mb-8">
              A premium mobile tattoo fleet operating across TN, TX, AZ, OK, and FL. We bring the studio to you.
            </p>
          </div>
          
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-white mb-6">Operations</h3>
            <ul className="space-y-4 font-sans text-muted-foreground">
              <li><a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a></li>
              <li><a href="#packages" className="hover:text-white transition-colors">Experiences</a></li>
              <li><a href="#tour" className="hover:text-white transition-colors">Tour Dates</a></li>
              <li><a href="/customer/" className="hover:text-white transition-colors">Book the Fleet</a></li>
              <li><a href="/artist/" className="hover:text-white transition-colors">Artist Signup</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-white mb-6">Connect</h3>
            <ul className="space-y-4 font-sans text-muted-foreground">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-white transition-colors">dispatch@wheelhousetattoo.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Wheelhouse Tattoo Co.
          </p>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            Ink Meets The Road
          </p>
        </div>
      </div>
    </footer>
  );
}
