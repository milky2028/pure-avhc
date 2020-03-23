export default class Address {
  isBilling = false;
  uid = '';
  enabled = false;
  dateCreated = new Date();
  dateModified = new Date();
  name = '';
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  zipCode: string | number = '';
  country = '';

  constructor(address: Partial<Address> = {}) {
    Object.assign(this, address);
  }
}
