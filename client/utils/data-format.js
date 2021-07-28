/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import {
  PhoneNumberUtil,
  PhoneNumberFormat as PNF
} from 'google-libphonenumber';

export const converE164PhoneNumber = (str) => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const number = phoneUtil.parseAndKeepRawInput(str, 'US');
  return phoneUtil.format(number, PNF.E164);
};

export const cleanObject = (obj) => {
  const propNames = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < propNames.length; i += 1) {
    const propName = propNames[i];
    if (obj[propName] === null || obj[propName] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[propName];
    }
  }

  if (obj.__typename) {
    delete obj.__typename;
  }
  return obj;
};

export const cleanVehicle = (array) => {
  const tmp = [];
  array.forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    delete el.id;
    delete el.size;
    const cleanedObj = cleanObject(el);
    tmp.push(cleanedObj);
  });
  return tmp;
};

export const stringToHTML = (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc;
};
