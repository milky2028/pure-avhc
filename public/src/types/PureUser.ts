export default interface AvUser extends firebase.UserInfo {
  isAdmin: boolean;
  isWholesaleUser: boolean;
}
