import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Footer from "../components/layout/footer";

export default function Confirm() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-xl w-full text-center space-y-8 p-10 bg-card rounded-3xl border border-white/5 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Request Received</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for considering Wheelhouse Tattoo Co. for your event. We've received your details and our team will be in touch within 48 hours.
            </p>
          </div>

          <div className="bg-background/50 rounded-xl p-6 text-sm text-muted-foreground border border-white/5">
            <p>
              What happens next? We'll review your event details, check our rig availability, and prepare a custom proposal outlining logistics and pricing.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button size="lg" className="rounded-full px-8 h-14 text-base bg-white text-black hover:bg-white/90">
                Return to Homepage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}