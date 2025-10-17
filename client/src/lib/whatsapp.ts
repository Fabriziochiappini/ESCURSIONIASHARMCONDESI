import { Travel } from "@shared/schema";

const WHATSAPP_NUMBER = "393444585177"; // Numero WhatsApp Si viaggia con Desi

export function generateWhatsAppLink(travel: Travel, customMessage?: string): string {
  const baseMessage = customMessage || generateTravelMessage(travel);
  const encodedMessage = encodeURIComponent(baseMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function sendWhatsAppMessage(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

export function generateTravelMessage(travel: Travel): string {
  const priceFormatted = formatPrice(travel.price, travel.type);
  const travelTypeLabel = getTravelTypeLabel(travel.travelType);
  const contractTypeLabel = getContractTypeLabel(travel.type);
  
  return `✈️ Salve! Sono interessato/a a questo viaggio:

📍 *${travel.title}*
🌍 Destinazione: ${travel.destination}, ${travel.country}
🎒 Tipologia: ${travelTypeLabel || 'Non specificata'}
💰 Prezzo: ${priceFormatted}
📅 Durata: ${travel.duration} giorni
👥 Max partecipanti: ${travel.maxParticipants}
🎂 Età minima: ${travel.minAge} anni

Vorrei ricevere maggiori informazioni e possibilmente prenotare.

Grazie!`;
}

export function generateQuickInquiryMessage(travel: Travel): string {
  return `✈️ Ciao! Sono interessato/a al viaggio "${travel.title}" destinazione ${travel.destination}. Potreste inviarmi maggiori dettagli? Grazie!`;
}

export function shareOnWhatsApp(travel: Travel, travelUrl: string): void {
  const fullUrl = window.location.origin + travelUrl;
  const priceFormatted = formatPrice(travel.price, travel.type);
  
  const shareMessage = `🌟 Guarda questo tour fantastico! 🌟

📍 *${travel.title}*
${travel.destination ? `🌍 ${travel.destination}` : ''}
💰 A partire da ${priceFormatted}
${travel.duration ? `📅 Durata: ${travel.duration} ${travel.duration === 1 ? 'giorno' : 'giorni'}` : ''}

🔗 Scopri di più: ${fullUrl}`;

  const encodedMessage = encodeURIComponent(shareMessage);
  const url = `https://wa.me/?text=${encodedMessage}`;
  window.open(url, '_blank');
}

function formatPrice(price: string, type: string): string {
  const numPrice = parseInt(price);
  if (type === "mare" || type === "montagna") {
    return `€ ${numPrice.toLocaleString('it-IT')}/persona`;
  } else if (type === "citta" || type === "cultura") {
    return `€ ${numPrice.toLocaleString('it-IT')}/persona`;
  } else {
    return `€ ${numPrice.toLocaleString('it-IT')}/persona`;
  }
}

function getTravelTypeLabel(travelType?: string | null): string {
  if (!travelType) return '';
  
  switch(travelType) {
    case "singolo": return "Viaggio Singolo";
    case "coppia": return "Viaggio di Coppia";
    case "famiglia": return "Viaggio Famiglia";
    case "gruppo": return "Viaggio di Gruppo";
    default: return travelType;
  }
}

function getContractTypeLabel(type: string): string {
  switch (type) {
    case "mare": return "Vacanza al Mare";
    case "montagna": return "Avventura in Montagna";
    case "citta": return "City Break";
    case "cultura": return "Viaggio Culturale";
    case "avventura": return "Viaggio Avventura";
    case "relax": return "Viaggio Relax";
    default: return type;
  }
}