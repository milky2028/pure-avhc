export default interface AvUser {
  [key: string]: any;
  isAdmin: boolean;
  isWholesaleUser: boolean;
  canSubscribe?: boolean;
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}
