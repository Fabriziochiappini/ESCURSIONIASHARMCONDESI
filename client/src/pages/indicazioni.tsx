import { Navigation } from "@/components/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { 
  FileText, 
  Luggage, 
  Stethoscope, 
  Plug, 
  Lightbulb,
  Camera,
  Sun,
  Glasses,
  Waves,
  Pill
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Indicazioni() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F8FF] to-white">
      <AnnouncementBar />
      <Navigation />

      <main className="pt-20 lg:pt-[148px] pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-['Eagle_Lake'] text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent drop-shadow-sm mb-4">
              Indicazioni di Viaggio
            </h1>
            <p className="text-gray-600 text-lg">
              Tutto quello che devi sapere prima di partire per Sharm El Sheikh
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-red-700">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-2xl">DA PORTARE OBBLIGATORIAMENTE</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-red-100">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full flex-shrink-0">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Carta d'identità</h3>
                    <p className="text-gray-600">+ 2 fototessere</p>
                    <p className="text-gray-500 text-sm mt-1">oppure passaporto</p>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-green-800 font-medium flex items-center gap-2">
                    <span className="text-xl">💳</span>
                    Non è necessario cambiare valuta: le carte di pagamento sono accettate ovunque.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-amber-700">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Luggage className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-2xl">COSA METTERE IN VALIGIA 🧳</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-amber-100">
                    <Sun className="h-6 w-6 text-amber-500" />
                    <span className="text-gray-700 font-medium">Crema solare</span>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-amber-100">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-2xl">🧕</span>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">Foulard e cappellino</span>
                      <p className="text-gray-500 text-sm">(è possibile acquistare in loco la Kefiah, tradizionale copricapo arabo)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-amber-100">
                    <Glasses className="h-6 w-6 text-amber-500" />
                    <span className="text-gray-700 font-medium">Occhiali da sole</span>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-amber-100">
                    <Waves className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-gray-700 font-medium">Attrezzatura da snorkeling</span>
                      <p className="text-gray-500 text-sm">(se già in possesso; in alternativa è possibile noleggiarla sul posto)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl">KIT MEDICO ESSENZIALE</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                    <Pill className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Paracetamolo</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                    <Pill className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Farmaci antidiarroici</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                    <Pill className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Fermenti lattici</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-purple-700">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl">CONSIGLIO UTILE PRIMA DEL VIAGGIO</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <p className="text-gray-800 leading-relaxed">
                    È raccomandato preparare l'organismo assumendo <strong>fermenti lattici per circa una settimana</strong> prima della partenza.
                  </p>
                  <p className="text-purple-700 font-medium mt-3">
                    💊 In farmacia trovate le "Pastiglie del viaggiatore" (marca consigliata <strong>UNIGERMINA</strong>).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Plug className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-2xl">ADATTATORI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Non sono necessari adattatori particolari per le prese di corrente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-100 to-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-200 rounded-full">
                    <span className="text-3xl">🚐</span>
                  </div>
                  <p className="text-blue-800 font-semibold text-lg">
                    Tutte le escursioni includono il trasferimento da e per il villaggio.
                  </p>
                </div>
              </CardContent>
            </Card>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Per qualsiasi altra domanda, non esitare a contattarci su WhatsApp!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
