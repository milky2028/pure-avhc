import CartItem from './CartItem';

export default class AvUser {
  [key: string]: boolean | string | null | CartItem[] | Date;
  key = '';
  keyCreated = new Date();
  isAdmin = false;
  isWholesaleUser = false;
  canSubscribe = true;
  uid = '';
  email = '';
  displayName = '';
  phoneNumber = '';
  photoURL = '';
  cart = [] as CartItem[];

  constructor(options: Partial<AvUser> = {}) {
    Object.assign(this, options);
  }
}
