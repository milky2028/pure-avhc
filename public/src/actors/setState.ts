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
