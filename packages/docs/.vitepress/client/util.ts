export const formatTime = (t: Date | number) => {
  t = new Date(t);
  const year = t.getFullYear();

  const [ month, date, hours, minutes, seconds ] = [
    t.getMonth() + 1,
    t.getDate(),
    t.getHours(),
    t.getMinutes(),
    t.getSeconds(),
  ].map((n) => (n < 10 ? `0${n}` : n));

	return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
};
