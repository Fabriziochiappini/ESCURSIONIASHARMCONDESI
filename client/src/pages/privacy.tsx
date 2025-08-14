import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Mail, Phone, MapPin, Clock, FileText, Eye, Lock, Users, Database } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <SEOHead 
        title="Privacy Policy - Propato Travel Agenzia Viaggi"
        description="Informativa sulla Privacy di Propato Travel. Scopri come proteggiamo i tuoi dati personali in conformità al GDPR."
        keywords="privacy policy, gdpr, protezione dati, agenzia viaggi, propato travel, trattamento dati personali"
        canonicalUrl="https://propatotravel.com/privacy"
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2 text-white" />
              Privacy Policy
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
              Protezione dei Tuoi Dati
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              La tua privacy è importante per noi. Scopri come trattiamo e proteggiamo i tuoi dati personali.
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Informazioni di Base */}
            <Card className="mb-8 border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <FileText className="h-6 w-6 mr-3" />
                  Informazioni Generali
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Titolare del Trattamento</h3>
                    <p className="text-gray-700 mb-2"><strong>Propato Travel</strong></p>
                    <p className="text-gray-700">Agenzia Viaggi</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-700">Via Roma, 123 - 20121 Milano (MI)</span>
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-700">02 1234567</span>
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-700">info@propatotravel.it</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accordion per Sezioni Dettagliate */}
            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <Eye className="h-6 w-6 mr-3" />
                  Informativa Completa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  
                  <AccordionItem value="dati-raccolti" className="px-6">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-3" />
                        Quali Dati Raccogliamo
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Dati di Contatto:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Nome, cognome, indirizzo email, numero di telefono</li>
                          <li>Indirizzo di residenza (se fornito)</li>
                          <li>Preferenze di comunicazione</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Dati di Navigazione:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Indirizzo IP, tipo di browser, sistema operativo</li>
                          <li>Pagine visitate e tempo di permanenza</li>
                          <li>Cookie tecnici e di preferenza</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Dati di Viaggio:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Informazioni su pacchetti viaggio di interesse</li>
                          <li>Criteri di ricerca e preferenze</li>
                          <li>Documenti forniti per valutazioni</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="finalita" className="px-6">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3" />
                        Finalità del Trattamento
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Servizi di Viaggio:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Assistenza nella prenotazione e organizzazione viaggi</li>
                          <li>Valutazioni e perizie tecniche</li>
                          <li>Consulenza legale e finanziaria</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Comunicazione:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Risposta a richieste di informazioni</li>
                          <li>Invio di proposte commerciali pertinenti</li>
                          <li>Aggiornamenti su servizi e offerte viaggio</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Obblighi Legali:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Adempimenti fiscali e contabili</li>
                          <li>Conservazione documenti per normative settoriali</li>
                          <li>Antiriciclaggio e verifiche di legge</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="base-giuridica" className="px-6">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      <div className="flex items-center">
                        <Lock className="h-5 w-5 mr-3" />
                        Base Giuridica
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 space-y-3">
                      <ul className="list-disc list-inside space-y-2">
                        <li><strong>Consenso:</strong> Per invio di comunicazioni commerciali</li>
                        <li><strong>Esecuzione contratto:</strong> Per servizi immobiliari richiesti</li>
                        <li><strong>Legittimo interesse:</strong> Per proposte commerciali pertinenti</li>
                        <li><strong>Obbligo legale:</strong> Per adempimenti normativi</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="conservazione" className="px-6">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3" />
                        Conservazione dei Dati
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 space-y-3">
                      <ul className="list-disc list-inside space-y-2">
                        <li><strong>Dati di contatto:</strong> Fino alla revoca del consenso</li>
                        <li><strong>Dati contrattuali:</strong> 10 anni dalla conclusione del rapporto</li>
                        <li><strong>Dati fiscali:</strong> Secondo normativa tributaria vigente</li>
                        <li><strong>Cookie tecnici:</strong> Sessione di navigazione</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="diritti" className="px-6">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-3" />
                        I Tuoi Diritti
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 space-y-3">
                      <p className="mb-3">Hai diritto a:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li><strong>Accesso:</strong> Ottenere conferma del trattamento e copia dei dati</li>
                        <li><strong>Rettifica:</strong> Correggere dati inesatti o incompleti</li>
                        <li><strong>Cancellazione:</strong> Richiedere la rimozione dei tuoi dati</li>
                        <li><strong>Limitazione:</strong> Limitare il trattamento in determinate circostanze</li>
                        <li><strong>Portabilità:</strong> Ricevere i dati in formato strutturato</li>
                        <li><strong>Opposizione:</strong> Opporti al trattamento per motivi legittimi</li>
                        <li><strong>Reclamo:</strong> Presentare reclamo al Garante Privacy</li>
                      </ul>
                      <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                        <p className="font-semibold text-accent mb-2">Per esercitare i tuoi diritti:</p>
                        <p>Contattaci a: <strong>info@propatotravel.it</strong></p>
                        <p>Telefono: <strong>02 1234567</strong></p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cookie" className="px-6">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3" />
                        Cookie Policy
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Cookie Tecnici:</h4>
                        <p className="mb-2">Necessari per il funzionamento del sito (sempre attivi):</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Cookie di sessione per la navigazione</li>
                          <li>Cookie di preferenze utente</li>
                          <li>Cookie di sicurezza</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Cookie Analitici:</h4>
                        <p className="mb-2">Per analizzare l'utilizzo del sito (richiedono consenso):</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Statistiche di utilizzo anonime</li>
                          <li>Miglioramento esperienza utente</li>
                        </ul>
                      </div>
                      <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                        <p className="font-semibold text-primary">
                          Puoi gestire le tue preferenze sui cookie attraverso il banner che appare alla prima visita.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </CardContent>
            </Card>

            {/* Ultima Modifica */}
            <div className="text-center mt-12 text-gray-600">
              <p className="text-sm">
                Ultima modifica: <strong>31 Gennaio 2025</strong>
              </p>
              <p className="text-sm mt-2">
                Per domande su questa Privacy Policy, contattaci a: 
                <a href="mailto:info@propatotravel.it" className="text-primary hover:underline ml-1">
                  info@propatotravel.it
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}