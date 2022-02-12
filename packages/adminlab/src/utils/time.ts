const DEFAULT_FORMAT = "yyyy/MM/dd HH:mm:ss";
const formatReg = /yyyy|MM|M|mm|m|dd|d|HH|H|ss|s/g;

type TimeType = string | number | Date;

/**
 * 时间格式化
 * @param {Date|number} [time=new Date()] 时间格式或者是时间戳
 * @param {string} [format=yyyy/MM/dd HH:mm:ss] 要转成的格式, 说明（注意大小写）:
 * |格式|含义|备注|举例
 * |:--:|:--|:--|:--
 * |yyyy|年||2020
 * |M|月|不补0|1
 * |MM|月|补0|01
 * |d|日|不补0|2
 * |dd|日|补0|02
 * |H|小时|24小时制; 不补0|3
 * |HH|小时|24小时制; 补0|03
 * |m\|mm|分钟|以此类推|
 * |s\|ss|秒|以此类推|
 *
 * @returns { string }
 */
export function formatTime(time: TimeType, format = DEFAULT_FORMAT) {
  const dateMap = getDateMap(time);

  return format.replace(formatReg, ($1) => {
		// @ts-ignore
    const n = dateMap[$1.length === 4 ? $1 : $1.slice(0, 1)];
    return $1.length === 2 ? formatNumber(n) : n;
  });

  function formatNumber(n: number) {
    return n < 10 ? `0${n}` : n;
  }
}

function getDateMap(time: TimeType) {
	time = new Date(time);

  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  return {
    yyyy: year,
    M: month, // 月 不补0
    d: day, // 日 不补0
    H: hours, // 24小时制 不补0
    m: minutes, // 分钟 不补0
    s: seconds // 秒 不补0
  };
}
