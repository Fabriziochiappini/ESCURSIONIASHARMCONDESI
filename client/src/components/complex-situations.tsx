import { CheckCircle, Scale, AlertTriangle, Receipt } from "lucide-react";

export function ComplexSituations() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Situazioni Complesse? Abbiamo la Soluzione
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Grazie alla sinergia tra il nostro team legale e l'area tecnica specializzata, 
            risolviamo le situazioni più difficili con soluzioni trasparenti e condivise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Situazione 1 - Casa con ipoteca */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg border border-blue-200">
            <div className="flex items-start mb-6">
              <div className="bg-primary text-white p-3 rounded-xl mr-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Casa con ipoteca e da ristrutturare?
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  Ti offriamo una soluzione trasparente:
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-base">Nessun costo anticipato</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-base">Prezzo minimo garantito per te</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-base">Azzeramento di debiti e gravami</span>
              </li>
            </ul>

            <p className="text-sm text-gray-600 italic">
              Tutto avviene attraverso un accordo trasparente e condiviso.
            </p>
          </div>

          {/* Situazione 3 - Casa all'asta */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-lg border border-red-200">
            <div className="flex items-start mb-6">
              <div className="bg-secondary text-white p-3 rounded-xl mr-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  La tua casa rischia di andare all'asta?
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  Possiamo aiutarti con soluzioni efficaci:
                </p>
              </div>
            </div>

            <div className="text-gray-700 mb-6 space-y-3">
              <p className="text-base">
                Grazie al nostro team legale e perizie specializzate, proponiamo 
                <strong className="text-secondary"> soluzioni di saldo e stralcio</strong>, 
                riducendo significativamente l'ammontare del debito.
              </p>
              <p className="text-base">
                Quando necessario, interveniamo direttamente sull'immobile pignorato, 
                concordando una <strong className="text-secondary">vendita a valore ridotto</strong> 
                per recuperare il massimo possibile.
              </p>
            </div>
          </div>

          {/* Situazione 4 - Debiti Agenzia Entrate */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border border-green-200">
            <div className="flex items-start mb-6">
              <div className="bg-green-600 text-white p-3 rounded-xl mr-4">
                <Receipt className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Debiti con l'Agenzia delle Entrate?
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  Valutiamo ogni caso per trovare la soluzione:
                </p>
              </div>
            </div>

            <div className="text-gray-700 mb-6 space-y-3">
              <p className="text-base">
                Verifichiamo la <strong className="text-green-600">legittimità delle ipoteche</strong> 
                iscritte sull'immobile e interveniamo per rimuovere eventuali irregolarità.
              </p>
              <p className="text-base">
                Proponiamo <strong className="text-green-600">piani di rientro rateizzati</strong>, 
                compatibili con la tua situazione economica.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Hai una situazione complessa?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Contattaci per una consulenza gratuita e senza impegno
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+393468003234" 
                className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                📞 Chiama ora: 346 800 3234
              </a>
              <a 
                href="mailto:agenzia2acireale@virgilio.it" 
                className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-colors inline-flex items-center justify-center"
              >
                ✉️ Scrivi una email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}