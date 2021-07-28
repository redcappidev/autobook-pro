import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import pntt from 'phone-number-to-timezone';
import moment from 'moment-timezone';

export const getFormattedPhoneNumber = (cell, format = 'E164', country = 'US') => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  try {
    const inputNumber = phoneUtil.parse(cell, country);
    const isValid = phoneUtil.isValidNumber(inputNumber);
    if (isValid) {
      if (format === 'INTERNATIONAL') {
        return phoneUtil.format(inputNumber, PhoneNumberFormat.INTERNATIONAL);
      }
      return phoneUtil.format(inputNumber, PhoneNumberFormat.E164);
    }

    return null;
  } catch (e) {
    return cell;
  }
};

export const convertFormat = (cell) => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  try {
    const inputNumber = phoneUtil.parseAndKeepRawInput(cell);
    return phoneUtil.format(inputNumber, PhoneNumberFormat.NATIONAL);
  } catch (e) {
    return cell;
  }
};

export const getTimezoneFromPhoneNumber = (cell, gmtLabel = false) => {
  if (!cell) return null;

  const info = pntt.getLocalInfo(cell);

  if (!info.time) return null;

  if (gmtLabel) return info.time.zone;

  const isDST = moment().isDST();
  if (info.time.zone === 'GMT-5' && !isDST) return 'EST';
  if (info.time.zone === 'GMT-4' && isDST) return 'EST';

  if (info.time.zone === 'GMT-6' && !isDST) return 'CST';
  if (info.time.zone === 'GMT-5' && isDST) return 'CST';

  if (info.time.zone === 'GMT-7' && !isDST) return 'MT';
  if (info.time.zone === 'GMT-6' && isDST) return 'MT';

  if (info.time.zone === 'GMT-8' && !isDST) return 'PST';
  if (info.time.zone === 'GMT-7' && isDST) return 'PST';

  return info.time.zone;
};
