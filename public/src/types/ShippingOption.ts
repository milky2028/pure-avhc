export default class ShippingOption {
  id = '';
  type = '';
  display = '';
  price = 7.99;
  site = [];

  constructor(options: Partial<ShippingOption> = {}) {
    Object.assign(this, options);
  }
}
