/**
 * Formats a number as CFA Franc currency
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the currency symbol
 * @returns Formatted currency string
 */
export function formatCFA(amount: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `${formatted} FCFA` : formatted;
}

/**
 * Parses a CFA currency string to number
 * @param value - The currency string to parse
 * @returns Parsed number
 */
export function parseCFA(value: string): number {
  return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
}

/**
 * Converts Euro to CFA Franc (approximate rate)
 * @param euroAmount - Amount in euros
 * @returns Amount in CFA Francs
 */
export function euroToCFA(euroAmount: number): number {
  // Approximate conversion rate: 1 EUR = 656 FCFA
  return Math.round(euroAmount * 656);
}

/**
 * Gets Gabonese provinces for address forms
 */
export function getGaboneseProvinces(): string[] {
  return [
    'Estuaire',
    'Haut-Ogooué',
    'Moyen-Ogooué',
    'Ngounié',
    'Nyanga',
    'Ogooué-Ivindo',
    'Ogooué-Lolo',
    'Ogooué-Maritime',
    'Woleu-Ntem'
  ];
}

/**
 * Validates Gabonese phone number format
 * @param phone - Phone number to validate
 * @returns Whether the phone number is valid
 */
export function validateGabonesePhone(phone: string): boolean {
  // Gabonese phone numbers: +241 XX XX XX XX or 0X XX XX XX XX
  const phoneRegex = /^(\+241|0)[1-9]\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}