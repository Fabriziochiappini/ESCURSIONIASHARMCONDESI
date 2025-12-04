import { useState } from "react";
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
  Calendar,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import { isAuthValid, setAuthToken, clearAuthToken } from "@/lib/adminAuth";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthValid());

  const handleLogin = () => {
    setAuthToken();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Pannello Admin
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Benvenuto nell'area riservata
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Torna al Sito
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            
            <Link href="/admin/addons">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <Plus className="h-5 w-5" />
                    Add-on / Upsell
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Crea e gestisci add-on da associare ai tour (es. cena, barca)</p>
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