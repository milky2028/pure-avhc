interface Mutation<T> {
  type: string;
  data: T;
}

interface State {
  [key: string]: any;
}

export default function setState<M>(state: State, { type, data }: Mutation<M>) {
  return (state[type] = data);
}

export function setAllStateInObj(originalObj: State, targetObj: State) {
  for (const key of Object.keys(targetObj)) {
    const objValue = targetObj[key];
    setState(originalObj, { type: key, data: objValue });
  }
}
