interface Mutation<T> {
  type: string;
  data: T;
}

function setState<M>(state: Record<string, any>, { type, data }: Mutation<M>) {
  return (state[type] = data);
}

export default function setAllStateInObj(
  originalObj: Record<string, any>,
  targetObj: Record<string, any>
) {
  for (const key of Object.keys(targetObj)) {
    const objValue = targetObj[key];
    setState(originalObj, { type: key, data: objValue });
  }
}
