export default interface Address {
  isBilling: boolean;
  uid: string;
  enabled: boolean;
  dateCreated: Date;
  dateModified: Date;
  name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: number | string;
  country: string;
}
