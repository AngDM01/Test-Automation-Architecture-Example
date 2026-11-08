export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
