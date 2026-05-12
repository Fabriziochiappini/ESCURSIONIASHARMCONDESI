import { Navigation } from "@/components/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Briefcase,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  UserCheck,
  Lock,
  Scale,
  Mail,
  Phone,
} from "lucide-react";

export default function Termini() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <SEOHead
        title="Termini e Condizioni - Si viaggia con Desi"
        description="Termini e Condizioni di Si Viaggia Con Desi. Consulenza, assistenza e intermediazione turistica per escursioni a Sharm El Sheikh."
        keywords="termini e condizioni, condizioni d'uso, prenotazioni, rimborsi, tour operator, sharm el sheikh"
        canonicalUrl="https://siviaggiascondesi.it/termini"
      />
      <AnnouncementBar />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
              <FileText className="h-4 w-4 mr-2 text-white" />
              Termini e Condizioni
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
              Benvenuto su Si Viaggia Con Desi 🌴
            </h1>
            <p className="text-xl md:text-2xl text-white mb-2 max-w-3xl mx-auto opacity-90">
              Le presenti Condizioni disciplinano l'utilizzo del sito, dei canali di prenotazione e
              dei servizi proposti da Si Viaggia Con Desi.
            </p>
            <p className="text-base md:text-lg text-white max-w-3xl mx-auto opacity-80 mt-4">
              Effettuando una prenotazione o utilizzando i nostri servizi, il cliente dichiara di
              aver letto, compreso e accettato integralmente quanto riportato di seguito.
            </p>
          </div>
        </section>

        {/* Contenuto T&C */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <Briefcase className="h-6 w-6 mr-3" />
                  1. Attività svolta da Si Viaggia Con Desi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Si Viaggia Con Desi si occupa di consulenza, assistenza e intermediazione
                  turistica nella promozione di escursioni, esperienze e servizi turistici.
                </p>
                <p>
                  Per garantire ai clienti esperienze affidabili e di qualità, vengono selezionati
                  con attenzione partner e fornitori locali sulla base dell'esperienza,
                  dell'organizzazione e degli standard offerti.
                </p>
                <p>
                  L'organizzazione pratica e l'esecuzione delle attività prenotate vengono tuttavia
                  gestite direttamente dagli operatori locali incaricati del servizio.
                </p>
                <p>
                  Si Viaggia Con Desi <strong>non gestisce direttamente</strong> mezzi di trasporto,
                  guide, imbarcazioni, strutture ricettive o servizi logistici collegati alle
                  escursioni e non opera come tour operator locale.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <CreditCard className="h-6 w-6 mr-3" />
                  2. Conferma delle Prenotazioni e Modalità di Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Per alcune attività può essere richiesto un acconto o una quota di conferma al
                  momento della prenotazione, tramite i metodi di pagamento indicati.
                </p>
                <p>
                  L'eventuale importo residuo potrà essere saldato direttamente al partner locale
                  oppure secondo le modalità comunicate al cliente prima dell'escursione.
                </p>
                <p>
                  Dopo la conferma, il cliente riceverà tutte le informazioni utili relative al
                  servizio prenotato, inclusi dettagli organizzativi, orari e punto di incontro.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <RefreshCcw className="h-6 w-6 mr-3" />
                  3. Modifiche, Cancellazioni e Rimborso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>Salvo diverse condizioni indicate per specifiche attività:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    le cancellazioni comunicate a ridosso dell'escursione possono comportare la
                    perdita dell'acconto versato;
                  </li>
                  <li>in caso di mancata presentazione non sarà previsto alcun rimborso;</li>
                  <li>
                    eventuali richieste di modifica saranno soggette alla disponibilità degli
                    operatori locali.
                  </li>
                </ul>
                <p>
                  Per motivi organizzativi, condizioni meteorologiche, sicurezza, forza maggiore o
                  disposizioni delle autorità locali, alcune attività potrebbero subire variazioni o
                  cancellazioni.
                </p>
                <p>Quando possibile verrà proposta:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>una nuova data;</li>
                  <li>un'esperienza alternativa;</li>
                  <li>oppure il rimborso delle somme versate.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <ShieldCheck className="h-6 w-6 mr-3" />
                  4. Assicurazione e Responsabilità
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Si Viaggia Con Desi opera regolarmente con <strong>Partita IVA</strong> ed è
                  coperta da <strong>polizza assicurativa professionale</strong> prevista per le
                  attività di agenzia viaggi e intermediazione turistica, secondo la normativa
                  italiana vigente.
                </p>
                <p>
                  Le escursioni e le esperienze vengono svolte operativamente da fornitori locali
                  indipendenti, che agiscono sotto la propria responsabilità organizzativa, civile e
                  legale.
                </p>
                <p>
                  Eventuali coperture assicurative relative allo svolgimento pratico delle attività
                  vengono fornite direttamente dagli operatori locali secondo la normativa del Paese
                  in cui il servizio viene erogato.
                </p>
                <p>Prenotando un'attività, il cliente prende atto che:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>alcune esperienze possono comportare rischi legati alla natura dell'attività stessa;</li>
                  <li>ogni partecipante è responsabile di verificare la propria idoneità fisica;</li>
                  <li>
                    eventuali ritardi, modifiche operative, disservizi o problematiche derivanti
                    dall'esecuzione materiale del servizio sono attribuibili al fornitore locale
                    incaricato dell'attività.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <UserCheck className="h-6 w-6 mr-3" />
                  5. Obblighi del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>Il cliente si impegna a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>fornire dati corretti e aggiornati;</li>
                  <li>rispettare gli orari e gli appuntamenti comunicati;</li>
                  <li>attenersi alle indicazioni fornite dagli operatori locali;</li>
                  <li>comportarsi in modo corretto durante lo svolgimento delle attività prenotate.</li>
                </ul>
                <p>
                  Con la prenotazione il cliente conferma inoltre di aver preso visione e accettato
                  integralmente i presenti Termini e Condizioni.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <Lock className="h-6 w-6 mr-3" />
                  6. Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  I dati personali comunicati dal cliente saranno utilizzati esclusivamente per
                  finalità connesse alla prenotazione, all'assistenza e alla gestione operativa dei
                  servizi richiesti, nel rispetto della normativa vigente sulla privacy. Per i
                  dettagli completi consulta la nostra{" "}
                  <a href="/privacy" className="text-primary underline hover:opacity-80">
                    Privacy Policy
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <Scale className="h-6 w-6 mr-3" />
                  7. Legge Applicabile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>Le presenti Condizioni sono regolate dalla legge italiana.</p>
                <p>
                  Per qualsiasi controversia sarà competente il Foro previsto dalla normativa a
                  tutela del consumatore.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-lg bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Mail className="h-6 w-6 mr-3" />
                  Per assistenza o informazioni
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-gray-700">
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <a href="mailto:richieste@viaggiacondesi.com" className="text-primary hover:underline">
                    richieste@viaggiacondesi.com
                  </a>
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <a
                    href="https://wa.me/393444585177"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp: 344 458 5177
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-4 italic">Si Viaggia Con Desi 🌴</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
