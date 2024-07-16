import dayjs from "dayjs";
import { padStart } from "lodash";

export function getTime(val: string | Date | number) {
  return dayjs(val).format("HH:mm:ss");
}

export function diffTime(time: string) {
  const now = dayjs();
  const timeToCompare = dayjs(time);
  const diffInMinutes = timeToCompare.diff(now, "millisecond");

  return diffInMinutes;
}

export function getTimeFromNow(time: string) {
  const now = dayjs();
  const timeToCompare = dayjs(time);
  const secs = timeToCompare.diff(now, "second");
  const hours = Math.floor(secs / 3600);
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);

  if (hours <= 0 && minutes <= 0 && seconds <= 0) return 0;

  return `${padStart(hours.toString(), 2, "0")}:${padStart(
    minutes.toString(),
    2,
    "0",
  )}:${padStart(seconds.toString(), 2, "0")}`;
}

export function formatTime(time: string, format = "YYYY-MM-DD") {
  return dayjs(time).format(format);
}
