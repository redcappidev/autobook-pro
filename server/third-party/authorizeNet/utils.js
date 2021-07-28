export const getRandomString = (text) =>
  text + Math.floor((Math.random() * 100000) + 1);

export const getRandomInt = () =>
  Math.floor((Math.random() * 100000) + 1);

export const getRandomAmount = () =>
  ((Math.random() * 100) + 1).toFixed(2);

export const getDate = () =>
  (new Date()).toISOString().substring(0, 10);
