import {
  fromUnixTime,
  format,
  formatISO,
  parseISO,
  startOfYesterday,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import momenttz from 'moment-timezone';
import { DATE_RANGE } from '@server/constants';

export const getDateRange = (str) => {
  const today = new Date();

  switch (str) {
    case DATE_RANGE.today:
      return {
        startDate: startOfDay(today),
        endDate: endOfDay(today)
      };
    case DATE_RANGE.week:
      return {
        startDate: startOfWeek(today),
        endDate: endOfWeek(today)
      };
    case DATE_RANGE.month:
      return {
        startDate: startOfMonth(today),
        endDate: endOfMonth(today)
      };
    case DATE_RANGE.pastDue:
      return {
        startDate: null,
        endDate: startOfYesterday()
      };
    case DATE_RANGE.all:
      return null;
    default:
      return null;
  }
};

export const getDayOfWeek = (date = new Date()) => format(date, 'iiii');

export const getHour = (date = new Date()) => format(date, 'HH');

export const getMinute = (date = new Date()) => format(date, 'mm');

export const getDateStringFromString = (date) =>
  formatISO(parseISO(date), { representation: 'date' });

export const getDateStringFromDateObject = (date) =>
  date.toISOString().substr(0, 10);

export const getDateTimeStringFromTimestamp = (timestamp) => fromUnixTime(timestamp).toISOString();

export const formatDate = (date = new Date(), dateFormat = 'MM/dd/yyyy HH:mm:ss') => {
  const timeZone = momenttz.tz.guess();
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, [dateFormat], { timeZone });
};

export const formatEST = (date = new Date(), dateFormat = 'MM/dd/yyyy HH:mm:ss') => {
  const timeZone = 'America/New_York';
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, [dateFormat], { timeZone });
};

export const formatCST = (date = new Date(), dateFormat = 'MM/dd/yyyy HH:mm:ss') => {
  const timeZone = 'America/Chicago';
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, [dateFormat], { timeZone });
};

export const formatMST = (date = new Date(), dateFormat = 'MM/dd/yyyy HH:mm:ss') => {
  const timeZone = 'America/Denver';
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, [dateFormat], { timeZone });
};

export const formatPST = (date = new Date(), dateFormat = 'MM/dd/yyyy HH:mm:ss') => {
  const timeZone = 'America/Los_Angeles';
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, [dateFormat], { timeZone });
};

export const formatTimestamp = (timestamp, dateFormat = 'MM/dd/yyyy HH:mm:ss') => formatDate(fromUnixTime(timestamp), dateFormat);

export const formatString = (date, dateFormat = 'MM/dd/yyyy HH:mm:ss') => formatDate(parseISO(date), dateFormat);

export const getGMTOffsetFromTimezone = (timezone) => {
  const isDST = momenttz().isDST();

  if (isDST && timezone === 'EST') return 'GMT-4';
  if (!isDST && timezone === 'EST') return 'GMT-5';

  if (isDST && timezone === 'CST') return 'GMT-5';
  if (!isDST && timezone === 'CST') return 'GMT-6';

  if (isDST && timezone === 'MT') return 'GMT-6';
  if (!isDST && timezone === 'MT') return 'GMT-7';

  if (isDST && timezone === 'PST') return 'GMT-7';
  if (!isDST && timezone === 'PST') return 'GMT-8';

  return null;
};
