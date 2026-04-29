export function formatCurrency(
  amount: number,
  currency: "XAF" | "CAD"
): string {
  if (currency === "XAF") {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

export function generateReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "ECO-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// Taux fixe pour démo — en production, utiliser une API de taux
export const EXCHANGE_RATES = {
  CAD_TO_XAF: 450,
  XAF_TO_CAD: 1 / 450,
};

export const FEE_PERCENTAGE = 0.01; // 1%

export function calculateFees(amount: number): number {
  return Math.round(amount * FEE_PERCENTAGE * 100) / 100;
}

export function calculateReceived(
  amount: number,
  fromCurrency: "CAD" | "XAF",
  toCurrency: "CAD" | "XAF"
): number {
  const fees = calculateFees(amount);
  const netAmount = amount - fees;

  if (fromCurrency === "CAD" && toCurrency === "XAF") {
    return Math.round(netAmount * EXCHANGE_RATES.CAD_TO_XAF);
  }
  if (fromCurrency === "XAF" && toCurrency === "CAD") {
    return Math.round(netAmount * EXCHANGE_RATES.XAF_TO_CAD * 100) / 100;
  }
  return netAmount;
}