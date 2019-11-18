export default interface AvUser {
  isAdmin: boolean;
  isWholesaleUser: boolean;
  canSubscribe: true;
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL: string;
}
