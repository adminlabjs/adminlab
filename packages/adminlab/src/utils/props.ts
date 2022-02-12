import { getCurrentInstance } from "vue";
import type { PropType, Prop } from "vue";

export const makeProps = <
  Key extends string,
  Value extends T,
  T extends unknown,
  D extends Value = any
>(
  keys: Key[],
  type: T,
  value?: D
) => {
  return keys.reduce((props, key) => {
    props[key] = {
      type: type as PropType<Value>,
      default: value,
    };
    return props;
  }, {} as Record<Key, Prop<Value, D>>);
};

export const getProps = <K extends string, V>(keys: K[]) => {
  type Props = Record<K, V>;
  const vm = getCurrentInstance()!;
  const props = vm.props as Props;

  return keys.reduce((obj, key) => {
    const val = props[key];
    if (val !== void 0) {
      obj[key] = val;
    }
    return obj;
  }, {} as Partial<Props>);
};

export const propsProxy = <
  K extends string,
  V extends T,
  T extends unknown,
  D extends V = any
>(
  keys: K[],
  type: T,
  value?: D
) => {
  return {
    make: () => {
			return makeProps<K, V, T, D>(keys, type, value);
		},

    get: () => {
			return getProps<K, V>(keys);
    },
  };
};

export const mergeClass = (obj: {
  class?: string;
}, ...classList: string[]) => {
  const _classList: string[] = classList.slice();
  if (obj.class) {
    _classList.push(obj.class);
  }

  return _classList.join(" ");
}
