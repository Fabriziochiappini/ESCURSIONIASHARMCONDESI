import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Footer } from "@/components/footer";
import { isAuthValid } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Calendar, User, Users, CreditCard, MapPin, CheckCircle2, Clock, XCircle, Filter, X, Phone, Mail, Eye, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Booking, Payment, Travel } from "@shared/schema";

type BookingWithDetails = Booking & {
  travel: Travel | null;
  payment: Payment | null;
};

type Order = {
  orderId: string;
  bookings: BookingWithDetails[];
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  totalAmount: number;
  orderTotal: number;
  status: string;
  bookingDate: Date | string;
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [tourFilter, setTourFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  useEffect(() => {
    if (!isAuthValid()) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: bookings = [], isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const { data: travels = [] } = useQuery<Travel[]>({
    queryKey: ["/api/travels"],
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

  // Logica di filtraggio
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Filtro per date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        
        switch (dateFilter) {
          case "today":
            return bookingDate >= today;
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return bookingDate >= yesterday && bookingDate < today;
          case "last7days":
            const last7days = new Date(today);
            last7days.setDate(last7days.getDate() - 7);
            return bookingDate >= last7days;
          case "last30days":
            const last30days = new Date(today);
            last30days.setDate(last30days.getDate() - 30);
            return bookingDate >= last30days;
          case "custom":
            if (customStartDate && customEndDate) {
              const start = new Date(customStartDate);
              const end = new Date(customEndDate);
              end.setHours(23, 59, 59, 999);
              return bookingDate >= start && bookingDate <= end;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Filtro per tour
    if (tourFilter !== "all") {
      filtered = filtered.filter(booking => booking.travelId === parseInt(tourFilter));
    }

    return filtered;
  }, [bookings, dateFilter, customStartDate, customEndDate, tourFilter]);

  // Raggruppa le prenotazioni per orderId
  const groupedOrders = useMemo(() => {
    const orderMap = new Map<string, Order>();
    
    filteredBookings.forEach(booking => {
      const orderId = (booking as any).orderId || `SINGLE-${booking.id}`;
      
      if (orderMap.has(orderId)) {
        const order = orderMap.get(orderId)!;
        order.bookings.push(booking);
        order.totalAmount += parseFloat(booking.totalAmount);
      } else {
        orderMap.set(orderId, {
          orderId,
          bookings: [booking],
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          totalAmount: parseFloat(booking.totalAmount),
          orderTotal: (booking as any).orderTotal ? parseFloat((booking as any).orderTotal) : parseFloat(booking.totalAmount),
          status: booking.status || 'pending',
          bookingDate: booking.bookingDate,
          payment: booking.payment,
        });
      }
    });

    return Array.from(orderMap.values()).sort((a, b) => 
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    );
  }, [filteredBookings]);

  const clearFilters = () => {
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setTourFilter("all");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Caricamento prenotazioni...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestione Prenotazioni e Pagamenti
          </h1>
          <p className="text-gray-600">
            Visualizza e gestisci tutte le prenotazioni ricevute con i dettagli dei pagamenti
          </p>
        </div>

        {/* Filtri */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtri di Ricerca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro Date */}
              <div className="space-y-2">
                <Label htmlFor="date-filter">Periodo</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="date-filter" data-testid="select-date-filter">
                    <SelectValue placeholder="Seleziona periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le date</SelectItem>
                    <SelectItem value="today">Oggi</SelectItem>
                    <SelectItem value="yesterday">Ieri</SelectItem>
                    <SelectItem value="last7days">Ultimi 7 giorni</SelectItem>
                    <SelectItem value="last30days">Ultimi 30 giorni</SelectItem>
                    <SelectItem value="custom">Intervallo personalizzato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Tour */}
              <div className="space-y-2">
                <Label htmlFor="tour-filter">Tour</Label>
                <Select value={tourFilter} onValueChange={setTourFilter}>
                  <SelectTrigger id="tour-filter" data-testid="select-tour-filter">
                    <SelectValue placeholder="Seleziona tour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i tour</SelectItem>
                    {travels
                      .filter(t => t.available)
                      .map(travel => (
                        <SelectItem key={travel.id} value={travel.id.toString()}>
                          {travel.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pulsante Resetta */}
              <div className="space-y-2 flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                  data-testid="button-clear-filters"
                >
                  <X className="w-4 h-4 mr-2" />
                  Resetta Filtri
                </Button>
              </div>
            </div>

            {/* Date personalizzate */}
            {dateFilter === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Data Inizio</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    data-testid="input-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Data Fine</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    data-testid="input-end-date"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Elenco Ordini
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-base">
                  {groupedOrders.length} ordini
                </Badge>
                <Badge variant="secondary" className="text-base">
                  {filteredBookings.length} tour
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{bookings.length === 0 ? "Nessun ordine ancora registrato" : "Nessun ordine trovato con i filtri selezionati"}</p>
              </div>
            ) : (
              <>
                {/* Vista Mobile - Card cliccabili */}
                <div className="md:hidden space-y-3">
                  {groupedOrders.map((order) => {
                    const paidAmount = order.payment ? parseFloat(order.payment.amount) : 0;
                    const remaining = order.orderTotal - paidAmount;
                    return (
                      <div 
                        key={order.orderId}
                        onClick={() => {
                          setSelectedBooking(order.bookings[0]);
                          setIsDetailOpen(true);
                        }}
                        className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors border border-gray-200"
                        data-testid={`order-card-${order.orderId}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="outline" className="text-xs font-mono">{order.orderId.substring(0, 15)}...</Badge>
                              {order.bookings.length > 1 && (
                                <Badge className="text-xs bg-purple-500">{order.bookings.length} tour</Badge>
                              )}
                              {remaining > 0 ? (
                                <Badge className="text-xs bg-orange-500">Acconto</Badge>
                              ) : (
                                <Badge className="text-xs bg-green-500">Saldato</Badge>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900">{order.customerName}</p>
                            <div className="text-sm text-gray-600">
                              {order.bookings.map(b => b.travel?.title || "N/D").join(", ")}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm font-bold text-blue-600">Totale: €{order.totalAmount.toFixed(2)}</span>
                              {remaining > 0 && (
                                <span className="text-sm font-bold text-orange-600">Saldo: €{remaining.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vista Desktop - Tabella ordini raggruppati */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ordine</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tour</TableHead>
                        <TableHead>Totale</TableHead>
                        <TableHead>Pagato</TableHead>
                        <TableHead>Saldo</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedOrders.map((order) => {
                        const paidAmount = order.payment ? parseFloat(order.payment.amount) : 0;
                        const remaining = order.orderTotal - paidAmount;
                        return (
                          <TableRow key={order.orderId} data-testid={`order-row-${order.orderId}`}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col gap-1">
                                <span className="font-mono text-xs">
                                  {order.orderId.startsWith('SINGLE-') ? `#${order.orderId.replace('SINGLE-', '')}` : order.orderId.substring(0, 12)}
                                </span>
                                {order.bookings.length > 1 && (
                                  <Badge className="bg-purple-500 w-fit text-xs">{order.bookings.length} tour</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{order.customerName}</span>
                                <span className="text-xs text-gray-500">{order.customerEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.bookings.length === 1 
                                  ? order.bookings[0].travel?.title || "N/D"
                                  : `${order.bookings.length} tour`
                                }
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              €{order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span className="text-green-600 font-medium">€{paidAmount.toFixed(2)}</span>
                            </TableCell>
                            <TableCell>
                              {remaining <= 0 ? (
                                <Badge className="bg-green-500 text-white text-xs">Saldato</Badge>
                              ) : (
                                <span className="text-orange-600 font-bold">€{remaining.toFixed(2)}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusLabels[order.status || "pending"]?.variant || "outline"} className="text-xs">
                                {statusLabels[order.status || "pending"]?.label || order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {formatDate(order.bookingDate)}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderDetailOpen(true);
                                }}
                                data-testid={`button-detail-${order.orderId}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Dettaglio
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog Dettagli Prenotazione (Mobile) */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Prenotazione #{selectedBooking?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                {/* Stato */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Stato Prenotazione</span>
                  <Badge variant={statusLabels[selectedBooking.status || "pending"]?.variant || "outline"}>
                    {statusLabels[selectedBooking.status || "pending"]?.label || selectedBooking.status}
                  </Badge>
                </div>

                {/* Cliente */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Cliente
                  </h4>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Mail className="w-3 h-3" />
                    {selectedBooking.customerEmail}
                  </div>
                  {selectedBooking.customerPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone className="w-3 h-3" />
                      {selectedBooking.customerPhone}
                    </div>
                  )}
                </div>

                {/* Tour */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Tour
                  </h4>
                  <p className="font-medium">{selectedBooking.travel?.title || "N/D"}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.travel?.destination || "N/D"}</p>
                  <p className="text-xs text-gray-500 capitalize">{selectedBooking.travel?.type || ""}</p>
                </div>

                {/* Data e Partecipanti */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-xs text-gray-600 mb-1">Data Tour</h4>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedBooking.travelDate)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="text-xs text-gray-600 mb-1">Partecipanti</h4>
                    <p className="font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {selectedBooking.numberOfParticipants}
                    </p>
                  </div>
                </div>

                {/* Pagamento */}
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pagamento
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Importo Totale</span>
                      <span className="font-bold text-lg">€{parseFloat(selectedBooking.totalAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tipo Pagamento</span>
                      <Badge 
                        className={
                          getPaymentType(selectedBooking) === "Completo" 
                            ? "bg-green-500 text-white" 
                            : getPaymentType(selectedBooking) === "Acconto"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-500 text-white"
                        }
                      >
                        {getPaymentType(selectedBooking)}
                      </Badge>
                    </div>
                    {selectedBooking.payment && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Provider</span>
                          <span className="text-sm font-medium">
                            {providerLabels[selectedBooking.payment.paymentProvider] || selectedBooking.payment.paymentProvider}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Stato Pagamento</span>
                          <Badge variant={paymentStatusLabels[selectedBooking.payment.status]?.variant || "outline"}>
                            {paymentStatusLabels[selectedBooking.payment.status]?.label || selectedBooking.payment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Importo Pagato</span>
                          <span className="font-semibold">€{parseFloat(selectedBooking.payment.amount).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Data Prenotazione */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prenotato il</span>
                    <span className="text-sm font-medium">{formatDateTime(selectedBooking.bookingDate)}</span>
                  </div>
                </div>

                {/* Note */}
                {selectedBooking.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs text-gray-600 mb-1">Note</h4>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Dettaglio Ordine Completo */}
        <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Dettaglio Ordine
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Numero Ordine */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Numero Ordine:</span>
                    <span className="font-mono font-bold text-lg">
                      {selectedOrder.orderId.startsWith('SINGLE-') 
                        ? `#${selectedOrder.orderId.replace('SINGLE-', '')}` 
                        : selectedOrder.orderId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Data Ordine:</span>
                    <span className="font-medium">{formatDateTime(selectedOrder.bookingDate)}</span>
                  </div>
                </div>

                {/* Dati Cliente */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dati Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">Nome</span>
                      <p className="font-semibold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Email</span>
                      <p className="font-medium text-sm">{selectedOrder.customerEmail}</p>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div>
                        <span className="text-xs text-gray-500">Telefono</span>
                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tour Ordinati */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Tour Ordinati ({selectedOrder.bookings.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.bookings.map((booking, index) => (
                      <div key={booking.id} className="p-3 bg-white rounded-lg border border-green-100">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{booking.travel?.title || "Tour N/D"}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {booking.travelDate ? formatDate(booking.travelDate) : "Data da definire"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {booking.numberOfParticipants} partecipant{booking.numberOfParticipants > 1 ? 'i' : 'e'}
                              </span>
                            </div>
                            {booking.notes && (
                              <p className="mt-2 text-sm text-gray-500 italic">Note: {booking.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-green-700">€{parseFloat(booking.totalAmount).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Riepilogo Pagamento */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Riepilogo Pagamento
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                      <span className="text-gray-700">Totale Ordine:</span>
                      <span className="font-bold text-xl">€{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    
                    {selectedOrder.payment && (
                      <>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700">Metodo Pagamento:</span>
                          <span className="font-medium">
                            {providerLabels[selectedOrder.payment.paymentProvider] || selectedOrder.payment.paymentProvider}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700">Stato Pagamento:</span>
                          <Badge variant={paymentStatusLabels[selectedOrder.payment.status]?.variant || "outline"}>
                            {paymentStatusLabels[selectedOrder.payment.status]?.label || selectedOrder.payment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 bg-green-100 px-3 rounded-lg">
                          <span className="text-green-800 font-medium">Importo Pagato:</span>
                          <span className="font-bold text-xl text-green-700">€{parseFloat(selectedOrder.payment.amount).toFixed(2)}</span>
                        </div>
                        
                        {(() => {
                          const paidAmount = parseFloat(selectedOrder.payment.amount);
                          const remaining = selectedOrder.orderTotal - paidAmount;
                          if (remaining > 0) {
                            return (
                              <div className="flex justify-between items-center py-3 bg-orange-100 px-3 rounded-lg border-2 border-orange-300">
                                <span className="text-orange-800 font-bold">Saldo da Versare:</span>
                                <span className="font-bold text-2xl text-orange-700">€{remaining.toFixed(2)}</span>
                              </div>
                            );
                          }
                          return (
                            <div className="flex justify-between items-center py-3 bg-green-200 px-3 rounded-lg">
                              <span className="text-green-800 font-bold">Stato:</span>
                              <Badge className="bg-green-600 text-white text-base px-4 py-1">SALDATO</Badge>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>

                {/* Stato Ordine */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Stato Ordine:</span>
                  <Badge variant={statusLabels[selectedOrder.status || "pending"]?.variant || "outline"} className="text-base px-4 py-1">
                    {statusLabels[selectedOrder.status || "pending"]?.label || selectedOrder.status}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {bookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Totale Ordini</p>
                    <p className="text-2xl font-bold">{groupedOrders.length}</p>
                    <p className="text-xs text-gray-400">{filteredBookings.length} tour prenotati</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Ordini Confermati</p>
                    <p className="text-2xl font-bold text-green-600">
                      {groupedOrders.filter(o => o.status === "confirmed").length}
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
                      {groupedOrders.filter(o => o.status === "pending").length}
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
                      €{groupedOrders
                        .filter(o => o.payment?.status === "succeeded")
                        .reduce((sum, o) => sum + (o.payment ? parseFloat(o.payment.amount) : 0), 0)
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
