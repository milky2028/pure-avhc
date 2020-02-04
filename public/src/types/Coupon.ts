import { Site } from './Site';

export default interface Coupon {
  id: string;
  code: string;
  expirationDate: Date;
  site: Site[];
  amount: number;
  products: string[];
  type: 'percent' | 'fixed';
}
