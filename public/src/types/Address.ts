export default interface Address {
  isBilling: string;
  uid: string;
  enabled: boolean;
  dateCreated: Date;
  dateModified: Date;
  name: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
}
