export const isObject = (val: any): val is IObject => {
  return val && Object.prototype.toString.call(val) === "[object Object]";
};

export const isPromise = (val: any): val is Promise<any> => {
  return val && typeof val === "object" && val.then;
};

export const isFunction = (val: any): val is Function => {
  return val instanceof Function;
}

export const mergeObject = (...args: Record<string, any>[]) => {
  args = args.map((object) => {
    const obj: typeof object = {};

    if (object) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const val = object[key];
          if (val !== void 0) {
            obj[key] = val;
          }
        }
      }
    }

    return obj;
  });

	return Object.assign({}, ...args);
};
