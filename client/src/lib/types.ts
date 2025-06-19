export const MUNICIPALITIES = [
  "Acireale",
  "Aci Castello", 
  "Aci Catena",
  "Aci Sant'Antonio",
  "Santa Venerina",
  "Zafferana Etnea"
] as const;

export const PROPERTY_TYPES = [
  { value: "vendita", label: "Acquisto" },
  { value: "affitto", label: "Affitto" },
  { value: "casa_vacanza", label: "Casa Vacanza" }
] as const;

export const PRICE_RANGES = [
  { value: 100000, label: "€ 100.000" },
  { value: 200000, label: "€ 200.000" },
  { value: 300000, label: "€ 300.000" },
  { value: 500000, label: "€ 500.000+" }
] as const;

export function formatPrice(price: string, type: string, priceType?: string): string {
  const numPrice = parseFloat(price);
  const formatted = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(numPrice);

  if (priceType === 'monthly') {
    return `${formatted}/mese`;
  } else if (priceType === 'nightly') {
    return `${formatted}/notte`;
  }
  
  return formatted;
}
