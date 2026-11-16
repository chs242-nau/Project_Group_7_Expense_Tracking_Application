// Small functions used for formatting data

export const padding = (n) => String(n).padStart(2, '0');
export const money = (n) => `$${Number(n).toFixed(2)}`;
