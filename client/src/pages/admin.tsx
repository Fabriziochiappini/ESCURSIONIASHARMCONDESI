import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/admin/LoginForm";

import PropertyManager from "@/components/admin/PropertyManager";

import { 
  Building2, 
  FileText, 
  Users, 
  BarChart3,
  Plus,
  Settings,
  MapPin,
  Image
} from "lucide-react";
import { Link } from "wouter";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-20">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pannello Amministrazione
                </h1>
                <p className="text-gray-600 mt-2">
                  Benvenuto nell'area riservata
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsLoggedIn(false)}
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Torna al Sito
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacchetti Viaggio Totali</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 questo mese</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proprietà in Evidenza</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Aggiornate questa settimana</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizzazioni</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% vs mese scorso</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contatti</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">+8 questa settimana</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/admin/countries"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Gestione Paesi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Gestisci le destinazioni nella sezione homepage</p>
              </CardContent>
            </Card>
            
            <Link href="/admin/showcases">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Gestione Vetrine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gestisci le sezioni promozionali</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/galleries">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Gestione Gallerie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Crea e gestisci gallerie fotografiche</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Visualizza statistiche e report</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <PropertyManager />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}