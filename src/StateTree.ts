interface Subscription {
  unsubscribe: () => void;
}
type Subscriber<T> = (value: T) => void;
type Subscribe<T> = (fn: Subscriber<T>) => Subscription;
type Next<T> = (nextValue: T) => void;
type AddChild<T> = <K extends keyof T>(key: K, value: T[K]) => void;

interface StateTreeI<T> {
  subscribe: Subscribe<T>;
  next: Next<T>;
  getValue: () => T;
  addChild: AddChild<T>;
}

export class StateTree<T> implements StateTreeI<T> {
  private counter = 0;
  private subscribers: { [key: string]: Subscriber<T> } = {};
  private value: T;
  private id: string;
  private parent: StateTree<any> | undefined;

  public children: { [K in keyof T]?: StateTree<T[K]> } = {};

  public constructor(params: {
    value: T;
    id?: string;
    parent?: StateTree<any>;
  }) {
    const { id, value, parent } = params;
    this.id = id || 'root';
    this.parent = parent;
    this.value = value;
  }

  public addChild: AddChild<T> = (key, value) => {
    this.children = {
      ...this.children,
      [key]: new StateTree({ value, id: `${key}`, parent: this }),
    };
  };

  public next: Next<T> = nextValue => {
    if (this.value === nextValue) return;

    this.value = nextValue;
    Object.values(this.subscribers).forEach(subscriber => {
      subscriber(nextValue);
    });

    if (this.parent) {
      const parentValue = this.parent.getValue();
      this.parent.next({ ...parentValue, [this.id]: nextValue });
    }

    if (this.children) {
      Object.keys(this.children).forEach(id => {
        if (this.children[id as keyof T]) {
          this.children[id as keyof T]!.next(this.value![id as keyof T]);
        }
      });
    }
  };

  public subscribe: Subscribe<T> = subscriber => {
    this.counter++;
    const index = `${this.counter}`;
    this.subscribers[index] = subscriber;
    return {
      unsubscribe: () => {
        delete this.subscribers[index];
      },
    };
  };

  public getValue = () => this.value;
}

export function createStateTree<T>(state: T) {
  const rootStateTree = new StateTree({
    id: 'root',
    value: state,
  });

  for (const key in state) {
    const value = state[key];
    rootStateTree.addChild(key, value);
  }

  return rootStateTree;
}
