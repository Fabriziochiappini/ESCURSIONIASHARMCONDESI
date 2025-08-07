import { Property } from "@shared/schema";

const WHATSAPP_NUMBER = "3468003234"; // Numero WhatsApp AGENZIA 2

export function generateWhatsAppLink(property: Property, customMessage?: string): string {
  const baseMessage = customMessage || generatePropertyMessage(property);
  const encodedMessage = encodeURIComponent(baseMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function generatePropertyMessage(property: Property): string {
  const priceFormatted = formatPrice(property.price, property.type);
  const propertyTypeLabel = getPropertyTypeLabel(property.propertyType);
  const contractTypeLabel = getContractTypeLabel(property.type);
  
  return `🏠 Salve! Sono interessato/a a questa proprietà:

📍 *${property.title}*
🏘️ ${property.municipality}, ${property.location}
🏠 Tipologia: ${propertyTypeLabel || 'Non specificata'}
💰 Prezzo: ${priceFormatted}
🛏️ ${property.bedrooms} camere da letto
🚿 ${property.bathrooms} bagni
📐 ${property.area} mq

Vorrei ricevere maggiori informazioni e possibilmente programmare una visita.

Grazie!`;
}

export function generateQuickInquiryMessage(property: Property): string {
  return `🏠 Ciao! Sono interessato/a alla proprietà "${property.title}" a ${property.municipality}. Potreste inviarmi maggiori dettagli? Grazie!`;
}

function formatPrice(price: string, type: string): string {
  const numPrice = parseInt(price);
  if (type === "vendita") {
    return `€ ${numPrice.toLocaleString('it-IT')}`;
  } else if (type === "affitto") {
    return `€ ${numPrice.toLocaleString('it-IT')}/mese`;
  } else {
    return `€ ${numPrice.toLocaleString('it-IT')}/notte`;
  }
}

function getPropertyTypeLabel(propertyType?: string | null): string {
  if (!propertyType) return '';
  
  switch(propertyType) {
    case "villa": return "Villa Singola";
    case "appartamento": return "Appartamento";
    case "villa_a_schiera": return "Villa a Schiera";
    case "casa_singola_con_terreno": return "Casa Singola con Terreno";
    case "rustici_e_terreni": return "Rustici e Terreni";
    case "terreno_agricolo": return "Terreno Agricolo";
    case "terreno_edificabile": return "Terreno Edificabile";
    default: return propertyType;
  }
}

function getContractTypeLabel(type: string): string {
  switch (type) {
    case "vendita": return "Vendita";
    case "affitto": return "Affitto";
    case "casa_vacanza": return "Casa Vacanza";
    default: return type;
  }
}