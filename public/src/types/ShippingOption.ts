export default class ShippingOption {
  id = '';
  type = 'standard';
  display = 'USPS Priority Mail (2 Days)';
  price = 7.99;
  site = [];

  constructor(options: Partial<ShippingOption> = {}) {
    Object.assign(this, options);
  }
}
