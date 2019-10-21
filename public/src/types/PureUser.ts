export default interface PureUser extends firebase.User {
  isAdmin: boolean;
  isWholesaleUser: boolean;
}
