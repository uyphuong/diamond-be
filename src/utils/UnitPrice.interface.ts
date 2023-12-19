export interface UnitPrice {
  unit: 'hour' | 'minute';
  price: number;
  amount?: number;
}
