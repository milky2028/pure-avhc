import Address from './Address';

interface UserInfo {
  email: string;
  password: string;
  phoneNumber: string;
}

export default interface WholesaleUserInfo {
  isExistingUser: boolean;
  uid?: string;
  userInfo: UserInfo;
  shippingAddress: Address;
  billingAddress?: Address;
}
