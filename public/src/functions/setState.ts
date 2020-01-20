interface Mutation<T> {
  type: string;
  data: T;
}

interface State {
  [key: string]: any;
}

function setState<M>(state: State, { type, data }: Mutation<M>) {
  return (state[type] = data);
}

export default function setAllStateInObj(originalObj: State, targetObj: State) {
  for (const key of Object.keys(targetObj)) {
    const objValue = targetObj[key];
    setState(originalObj, { type: key, data: objValue });
  }
}
