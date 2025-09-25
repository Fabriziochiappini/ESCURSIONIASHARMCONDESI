import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Travel } from "@shared/schema";
import { formatPrice } from "@/lib/types";
// Import payment components when ready
// import { StripeCheckout } from "./stripe-checkout";
// import { PayPalCheckout } from "./paypal-checkout";

const bookingFormSchema = z.object({
  firstName: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  lastName: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono non valido"),
  numberOfTravelers: z.number().min(1, "Minimo 1 viaggiatore").max(20, "Massimo 20 viaggiatori"),
  travelDate: z.string().min(1, "Seleziona una data di partenza"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["stripe", "paypal"], {
    required_error: "Seleziona un metodo di pagamento",
  }),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingModalProps {
  travel: Travel;
  children: React.ReactNode;
}

export function BookingModal({ travel, children }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      numberOfTravelers: 1,
      travelDate: "",
      notes: "",
      paymentMethod: "stripe",
    },
  });

  // Calculate total price
  const numberOfTravelers = form.watch("numberOfTravelers");
  const basePrice = parseFloat(travel.price);
  const totalPrice = basePrice * numberOfTravelers;

  // Create booking and payment intent
  const createBookingMutation = useMutation({
    mutationFn: async (formData: BookingFormData) => {
      const bookingPayload = {
        travelId: travel.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        numberOfTravelers: formData.numberOfTravelers,
        travelDate: new Date(formData.travelDate),
        notes: formData.notes,
        totalPrice: totalPrice.toString(),
        status: 'pending' as const,
      };

      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: totalPrice,
        travelId: travel.id,
        bookingData: bookingPayload,
      });

      const jsonResponse = await response.json();
      return jsonResponse as { clientSecret: string; bookingId: number };
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setBookingId(data.bookingId);
      setShowPayment(true);
      toast({
        title: "Prenotazione creata",
        description: "Procedi con il pagamento per confermare la tua prenotazione.",
      });
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione della prenotazione.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    setBookingData(data);
    createBookingMutation.mutate(data);
  };

  const handlePaymentSuccess = () => {
    setIsOpen(false);
    setShowPayment(false);
    form.reset();
    setBookingData(null);
    toast({
      title: "Pagamento completato!",
      description: "La tua prenotazione è stata confermata. Riceverai un'email di conferma.",
    });
  };

  const handlePaymentError = () => {
    toast({
      title: "Errore nel pagamento",
      description: "Si è verificato un errore durante il pagamento. Riprova.",
      variant: "destructive",
    });
  };

  // Format travel date for display
  const formatTravelDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Prenota il tuo viaggio
          </DialogTitle>
        </DialogHeader>

        {!showPayment ? (
          <>
            {/* Travel Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">{travel.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {travel.destination}
                  </Badge>
                  <span className="text-gray-600">{travel.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>{travel.duration} giorni</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">
                  {formatPrice(travel.price, travel.type, travel.priceType)} / persona
                </span>
                <Badge variant="outline" className="bg-white">
                  <Users className="h-3 w-3 mr-1" />
                  Max {travel.maxParticipants} persone
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Booking Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Mario"
                            data-testid="input-firstName"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cognome *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Rossi"
                            data-testid="input-lastName"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="mario.rossi@email.com"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+39 123 456 7890"
                            data-testid="input-phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Travel Details */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numberOfTravelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numero viaggiatori *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max={travel.maxParticipants}
                            data-testid="input-numberOfTravelers"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="travelDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data di partenza *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            data-testid="input-travelDate"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note aggiuntive</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Richieste speciali, allergie, preferenze..."
                          className="min-h-[80px]"
                          data-testid="textarea-notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method Selection */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">
                        Metodo di pagamento *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="stripe" id="stripe" />
                            <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                              <CreditCard className="h-4 w-4" />
                              Carta di Credito
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                              <Banknote className="h-4 w-4" />
                              PayPal
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Prezzo per persona:</span>
                    <span>{formatPrice(travel.price, travel.type, travel.priceType || undefined)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Numero viaggiatori:</span>
                    <span>{numberOfTravelers}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Totale:</span>
                    <span className="text-blue-600">
                      € {totalPrice.toLocaleString("it-IT")}
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createBookingMutation.isPending}
                  data-testid="button-submit-booking"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creazione prenotazione...
                    </>
                  ) : (
                    "Procedi al pagamento"
                  )}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <>
            {/* Payment Section */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Riepilogo prenotazione</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Viaggio:</span>
                    <span className="font-medium">{travel.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data partenza:</span>
                    <span>{formatTravelDate(bookingData?.travelDate || "")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Viaggiatori:</span>
                    <span>{bookingData?.numberOfTravelers}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-green-300">
                    <span>Totale da pagare:</span>
                    <span className="text-green-700">€ {totalPrice.toLocaleString("it-IT")}</span>
                  </div>
                </div>
              </div>

              {/* Payment Components - Demo Mode */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-blue-800 mb-2">
                  {bookingData?.paymentMethod === "stripe" ? "Pagamento Stripe" : "Pagamento PayPal"}
                </h3>
                <p className="text-blue-700 mb-4">
                  Sistema di pagamento in modalità demo.
                </p>
                <Button
                  onClick={handlePaymentSuccess}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-demo-payment"
                >
                  Simula pagamento completato
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="w-full"
                data-testid="button-back-to-form"
              >
                Torna ai dettagli
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}