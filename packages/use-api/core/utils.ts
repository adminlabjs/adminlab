export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomDate = (start?: number) => {
  const now = new Date();
  const min = new Date(now);
  min.setMonth(1);
  min.setDate(1);

  const max = new Date(now);
  max.setMonth(12);
  max.setDate(31);

  return random(start || min.getTime(), max.getTime());
};

export const randomString = () => {
  const from = "abcdefghijklmnopqrstuvwxyz";
  const length = random(6, 11);
  let str = "";

  for (let i = 0; i < length; i++) {
    const n = random(0, from.length - 1);
    str += from[n];
  }
  return str;
};

export const randomColor = () => {
  const makeNumber = () => Math.floor(Math.random() * 256);
  const r = makeNumber();
  const g = makeNumber();
  const b = makeNumber();
  return `rgb(${r},${g},${b})`;
};

export const sleep = (n: number): Promise<void> => {
  return new Promise((resolve) => {
    let flag;
    const callback = () => {
      if (!flag) {
        resolve();
      }
    }

    setTimeout(callback, n);
    setTimeout(callback, n);
  });
};

export const wrap = (fn: (...args: any[]) => any, delay?: number) => {
  return sleep(delay === void 0 ? random(500, 1000) : delay).then(() => fn());
};
