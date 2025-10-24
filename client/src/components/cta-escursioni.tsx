import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function CtaEscursioni() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#A8CFEB] to-[#C5E1F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
          Vuoi unirti a noi?
        </h2>
        <p className="text-xl text-white/90 mb-8 font-light">
          Scopri tutte le nostre escursioni
        </p>
        <Button 
          size="lg" 
          className="bg-white text-[#A8CFEB] hover:bg-white/90 font-normal py-6 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
          asChild
        >
          <Link href="/viaggi">
            Scopri le Escursioni
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
