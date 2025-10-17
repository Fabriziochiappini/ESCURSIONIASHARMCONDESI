import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const whatsappNumber = "393444585177";
  const message = "Ciao! Vorrei informazioni sui vostri tour a Sharm El Sheikh.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label="Contattaci su WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
    </a>
  );
}