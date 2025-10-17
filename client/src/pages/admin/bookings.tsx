import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Calendar, User, Users, CreditCard, MapPin, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Booking, Payment, Travel } from "@shared/schema";

type BookingWithDetails = Booking & {
  travel: Travel | null;
  payment: Payment | null;
};

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "In Attesa", variant: "secondary" },
  confirmed: { label: "Confermata", variant: "default" },
  cancelled: { label: "Annullata", variant: "destructive" },
  completed: { label: "Completata", variant: "outline" },
};

const paymentStatusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "In Attesa", variant: "secondary" },
  succeeded: { label: "Pagato", variant: "default" },
  failed: { label: "Fallito", variant: "destructive" },
  cancelled: { label: "Annullato", variant: "outline" },
};

const providerLabels: Record<string, string> = {
  stripe: "Stripe",
  paypal: "PayPal",
};

export default function AdminBookings() {
  const { toast } = useToast();

  const { data: bookings = [], isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PUT", `/api/admin/bookings/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      toast({ title: "Stato prenotazione aggiornato!" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento dello stato", variant: "destructive" });
    },
  });

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/D";
    const d = new Date(date);
    return d.toLocaleDateString("it-IT", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  };

  const formatDateTime = (date: string | Date | null | undefined) => {
    if (!date) return "N/D";
    const d = new Date(date);
    return d.toLocaleDateString("it-IT", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPaymentType = (booking: BookingWithDetails) => {
    if (!booking.payment || !booking.travel) return "N/D";
    
    const totalAmount = parseFloat(booking.totalAmount);
    const paidAmount = parseFloat(booking.payment.amount);
    const travelPrice = parseFloat(booking.travel.price);
    const depositAmount = booking.travel.depositAmount ? parseFloat(booking.travel.depositAmount) : null;

    // Check if it's a deposit payment
    if (depositAmount && Math.abs(paidAmount - depositAmount) < 0.01) {
      return "Acconto";
    }
    
    // Check if it's a full payment
    if (Math.abs(paidAmount - totalAmount) < 0.01 || Math.abs(paidAmount - travelPrice) < 0.01) {
      return "Completo";
    }

    return "Parziale";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Caricamento prenotazioni...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestione Prenotazioni e Pagamenti
          </h1>
          <p className="text-gray-600">
            Visualizza e gestisci tutte le prenotazioni ricevute con i dettagli dei pagamenti
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Elenco Prenotazioni ({bookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nessuna prenotazione ancora registrata</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tour</TableHead>
                      <TableHead>Luogo</TableHead>
                      <TableHead>Data Tour</TableHead>
                      <TableHead>Persone</TableHead>
                      <TableHead>Importo</TableHead>
                      <TableHead>Tipo Pag.</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Stato Pag.</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Prenotato il</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} data-testid={`booking-row-${booking.id}`}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 font-medium">
                              <User className="w-3 h-3" />
                              {booking.customerName}
                            </div>
                            <span className="text-xs text-gray-500">{booking.customerEmail}</span>
                            {booking.customerPhone && (
                              <span className="text-xs text-gray-500">{booking.customerPhone}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.travel?.title || "N/D"}</span>
                            <span className="text-xs text-gray-500 capitalize">{booking.travel?.type || ""}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {booking.travel?.destination || "N/D"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {formatDate(booking.travelDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.numberOfParticipants}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          €{parseFloat(booking.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              getPaymentType(booking) === "Completo" 
                                ? "bg-green-500 text-white hover:bg-green-600" 
                                : getPaymentType(booking) === "Acconto"
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-gray-500 text-white hover:bg-gray-600"
                            }
                          >
                            {getPaymentType(booking)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.payment ? (
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              <span className="text-sm">
                                {providerLabels[booking.payment.paymentProvider] || booking.payment.paymentProvider}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/D</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.payment ? (
                            <Badge variant={paymentStatusLabels[booking.payment.status]?.variant || "outline"}>
                              {paymentStatusLabels[booking.payment.status]?.label || booking.payment.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline">N/D</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusLabels[booking.status || "pending"]?.variant || "outline"}>
                            {statusLabels[booking.status || "pending"]?.label || booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDateTime(booking.bookingDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {bookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Totale Prenotazioni</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Confermate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => b.status === "confirmed").length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">In Attesa</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {bookings.filter(b => b.status === "pending").length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Ricavo Totale</p>
                    <p className="text-2xl font-bold text-blue-600">
                      €{bookings
                        .filter(b => b.payment?.status === "succeeded")
                        .reduce((sum, b) => sum + (b.payment ? parseFloat(b.payment.amount) : 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
