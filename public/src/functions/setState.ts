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

export function setAllStateInObj(
  state: State,
  targetObj: { [key: string]: any }
) {
  for (const key of Object.keys(targetObj)) {
    const objValue = targetObj[key];
    setState(state, { type: key, data: objValue });
  }
}
