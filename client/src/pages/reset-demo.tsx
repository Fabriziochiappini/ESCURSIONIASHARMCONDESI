import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2, CheckCircle } from 'lucide-react';

export default function ResetDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string, deletedCount?: number} | null>(null);

  const handleReset = async () => {
    if (!confirm('ATTENZIONE: Questa operazione eliminerà TUTTI i viaggi demo/test dal database production (inclusi quelli con "prova", "moto", "test" nel titolo). I tuoi viaggi reali saranno preservati. Continuare?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/reset-demo-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Errore di connessione. Riprova.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Reset Database Production
            </CardTitle>
            <CardDescription>
              Elimina i viaggi demo dal database production mantenendo i viaggi reali
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Cosa fa questa operazione</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Elimina TUTTI i viaggi demo/test (titoli specifici + pattern matching)</li>
                <li>• I tuoi viaggi reali caricati dall'admin panel restano intatti</li>
                <li>• Risolve il problema dei viaggi placeholder nel sito deployato</li>
                <li>• Operazione irreversibile ma sicura per i tuoi dati</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">🚨 Viaggi che verranno eliminati</h3>
              <div className="text-sm text-red-700 space-y-2">
                <div>
                  <p className="font-semibold mb-1">Viaggi demo specifici:</p>
                  <div className="grid grid-cols-1 gap-1 ml-2">
                    <span>• Grecia Classica - Santorini, Dubai Moderno, Bali Spiritual</span>
                    <span>• Norvegia Fiordi, Marocco Imperiale, Weekend Romantico a Parigi</span>
                    <span>• Settimana Relax alle Maldive, Avventura Safari in Tanzania</span>
                    <span>• Tour Culturale in Giappone, Trekking nelle Dolomiti</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Pattern demo (tutti i viaggi che iniziano con):</p>
                  <div className="ml-2">
                    <span>• "prova", "moto", "test", "demo", "placeholder"</span>
                  </div>
                </div>
              </div>
            </div>

            {result && (
              <div className={`border rounded-lg p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Reset Completato!' : 'Errore'}
                  </span>
                </div>
                <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                {result.success && result.deletedCount !== undefined && (
                  <p className="text-sm text-green-600 mt-1">
                    Eliminati {result.deletedCount} viaggi demo dal database.
                  </p>
                )}
              </div>
            )}

            <Button 
              onClick={handleReset} 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Eliminazione in corso...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Elimina Viaggi Demo Dal Production
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Dopo il reset, ricarica la homepage per vedere solo i tuoi viaggi reali.</p>
              <p>Se hai problemi, contatta il supporto tecnico.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}