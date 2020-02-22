import CartItem from './CartItem';

export default interface AvUser {
  [key: string]: boolean | string | null | CartItem[] | Date;
  key: string;
  keyCreated: Date;
  isAdmin: boolean;
  isWholesaleUser: boolean;
  canSubscribe: boolean;
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  cart: CartItem[];
}
