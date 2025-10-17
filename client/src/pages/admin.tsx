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
  Settings,
  Image,
  Calendar
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

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/galleries">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Gestione Gallerie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Crea e gestisci gallerie fotografiche dei tour</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/guides">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Gestione Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Crea e gestisci guide per viaggiatori</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/bookings">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Prenotazioni e Pagamenti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gestisci prenotazioni e monitora i pagamenti Stripe/PayPal</p>
                </CardContent>
              </Card>
            </Link>
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