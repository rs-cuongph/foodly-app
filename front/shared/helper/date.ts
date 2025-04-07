import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import 'dayjs/locale/ja'; // Import Japanese locale
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone'; // Import timezone plugin
import utc from 'dayjs/plugin/utc';
const tzName = 'Asia/Ho_Chi_Minh';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.tz.setDefault(tzName);

export class DateHelper {
  static getNow() {
    return dayjs();
  }

  static getNowInUTC() {
    return dayjs().utc();
  }

  static toDayjs(date?: Date | string | null) {
    if (date) {
      return dayjs(date);
    }

    return dayjs();
  }

  static getDate(date?: Date | string | null) {
    if (date) {
      return dayjs(date);
    }

    return '';
  }

  static format(date?: Date | string | null, format?: string) {
    if (date) {
      return dayjs(date).format(format || 'YYYY/MM/DD HH:mm');
    }

    return '';
  }

  static formaToUTC(date?: Date | string | null) {
    if (date) {
      return dayjs(date).utc().toISOString();
    }

    return '';
  }

  static getDayName(date?: Date | string, lang?: string): string {
    if (date) {
      return dayjs
        .utc(date)
        .locale(lang || 'vi')
        .format('dd');
    }

    return '';
  }

  static fromNow(date?: Date | string | null) {
    if (date) {
      return dayjs(date).fromNow();
    }

    return '';
  }

  static isBefore(
    date?: Date | string | null,
    compareDate?: Date | string | null,
  ) {
    if (date && compareDate) {
      return dayjs(date).isBefore(compareDate);
    }

    return false;
  }

  static isAfter(
    date?: Date | string | null,
    compareDate?: Date | string | null,
  ) {
    if (date && compareDate) {
      return dayjs(date).isAfter(compareDate);
    }

    return false;
  }

  static isSame(
    date?: Date | string | null,
    compareDate?: Date | string | null,
  ) {
    if (date && compareDate) {
      return dayjs(date).isSame(compareDate);
    }
  }

  static isSameOrBefore(
    date?: Date | string | null,
    compareDate?: Date | string | null,
  ) {
    if (date && compareDate) {
      return dayjs(date).isSameOrBefore(compareDate);
    }
  }

  static isSameOrAfter(
    date?: Date | string | null,
    compareDate?: Date | string | null,
  ) {
    if (date && compareDate) {
      return dayjs(date).isSameOrAfter(compareDate);
    }
  }

  static diffDate(
    date?: Date | string | null,
    compareDate?: Date | string | null,
    unit?: QUnitType | OpUnitType,
  ) {
    if (date && compareDate) {
      return dayjs(date).diff(compareDate, unit);
    }

    return 0;
  }

  /**
   * Convert seconds to HH:MM:SS format
   * @param seconds Number of seconds to convert
   * @returns String in "HH:MM:SS" format
   */
  static formatSecondsToTime(seconds: number) {
    if (seconds <= 0) return '00:00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d`;
    }

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0'),
    ].join(':');
  }
}
