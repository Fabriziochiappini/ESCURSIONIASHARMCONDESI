import { Property } from "@shared/schema";

const WHATSAPP_NUMBER = "3479123456"; // Numero WhatsApp Propato Travel

export function generateWhatsAppLink(property: Property, customMessage?: string): string {
  const baseMessage = customMessage || generatePropertyMessage(property);
  const encodedMessage = encodeURIComponent(baseMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function generatePropertyMessage(property: Property): string {
  const priceFormatted = formatPrice(property.price, property.type);
  const propertyTypeLabel = getPropertyTypeLabel(property.propertyType);
  const contractTypeLabel = getContractTypeLabel(property.type);
  
  return `✈️ Salve! Sono interessato/a a questo viaggio:

📍 *${property.title}*
🌍 Destinazione: ${property.municipality}, ${property.location}
🎒 Tipologia: ${propertyTypeLabel || 'Non specificata'}
💰 Prezzo: ${priceFormatted}
📅 Durata: ${property.bedrooms} giorni
👥 Max partecipanti: ${property.bathrooms}
🎂 Età minima: ${property.area} anni

Vorrei ricevere maggiori informazioni e possibilmente prenotare.

Grazie!`;
}

export function generateQuickInquiryMessage(property: Property): string {
  return `✈️ Ciao! Sono interessato/a al viaggio "${property.title}" destinazione ${property.municipality}. Potreste inviarmi maggiori dettagli? Grazie!`;
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

function getPropertyTypeLabel(propertyType?: string | null): string {
  if (!propertyType) return '';
  
  switch(propertyType) {
    case "singolo": return "Viaggio Singolo";
    case "coppia": return "Viaggio di Coppia";
    case "famiglia": return "Viaggio Famiglia";
    case "gruppo": return "Viaggio di Gruppo";
    default: return propertyType;
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