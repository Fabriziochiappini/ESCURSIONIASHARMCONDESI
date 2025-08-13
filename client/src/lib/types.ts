export const COUNTRIES = [
  "Italia",
  "Francia", 
  "Spagna",
  "Grecia",
  "Maldive",
  "Tanzania",
  "Giappone",
  "Thailandia",
  "Stati Uniti",
  "Brasile"
] as const;

export const TRAVEL_TYPES = [
  { value: "mare", label: "Mare" },
  { value: "montagna", label: "Montagna" },
  { value: "citta", label: "Città" },
  { value: "avventura", label: "Avventura" },
  { value: "relax", label: "Relax" },
  { value: "cultura", label: "Cultura" }
] as const;

export const TRAVEL_CATEGORIES = [
  { value: "singolo", label: "Singolo" },
  { value: "coppia", label: "Coppia" },
  { value: "famiglia", label: "Famiglia" },
  { value: "gruppo", label: "Gruppo" }
] as const;

export const PRICE_RANGES = [
  { value: 200, label: "€ 200" },
  { value: 500, label: "€ 500" },
  { value: 1000, label: "€ 1.000" },
  { value: 2000, label: "€ 2.000+" }
] as const;

export const DURATION_RANGES = [
  { value: 3, label: "3 giorni" },
  { value: 7, label: "1 settimana" },
  { value: 10, label: "10 giorni" },
  { value: 14, label: "2 settimane" }
] as const;

export function formatPrice(price: string, type: string, priceType?: string): string {
  const numPrice = parseFloat(price);
  const formatted = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(numPrice);

  if (priceType === 'giornaliero') {
    return `${formatted}/giorno`;
  } else if (priceType === 'forfait') {
    return `${formatted} (forfait)`;
  }
  
  return `da ${formatted}`;
}

export function formatDuration(days: number): string {
  if (days === 1) return "1 giorno";
  if (days < 7) return `${days} giorni`;
  if (days === 7) return "1 settimana";
  if (days === 14) return "2 settimane";
  if (days > 7 && days < 14) return `${days} giorni`;
  return `${days} giorni`;
}

export function getTravelTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    mare: "🏖️",
    montagna: "🏔️", 
    citta: "🏛️",
    avventura: "🏃‍♂️",
    relax: "🧘‍♀️",
    cultura: "🎨"
  };
  return icons[type] || "✈️";
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    singolo: "👤",
    coppia: "💑",
    famiglia: "👪",
    gruppo: "👥"
  };
  return icons[category] || "👤";
}