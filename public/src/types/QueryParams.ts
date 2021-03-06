export default interface QueryParams {
  fieldPath: string;
  operator: firebase.firestore.WhereFilterOp;
  compareValue: string | boolean | Date;
}
