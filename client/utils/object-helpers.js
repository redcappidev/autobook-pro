export const extractKeysIntoObject = (json, keys) =>
  keys.reduce((m, key) => {
    const isNumber = typeof json[key] === 'number';
    const isBoolean = typeof json[key] === 'boolean';

    if (!isNumber && !isBoolean && !json[key]) return m;
    return { ...m, [key]: json[key] };
  }, {});

export const sanitizeObject = (json) => Object.keys(json).reduce((m, key) => {
  const isNumber = typeof json[key] === 'number';
  const isBoolean = typeof json[key] === 'boolean';
  if (!isNumber && !isBoolean && !json[key]) return m;
  if (key === '__typename') return m;
  return {
    ...m,
    [key]: json[key]
  };
}, {});

export const changeArrayOrder = (arr, type, id) => {
  const idx = arr.findIndex((e) => e.id === id);
  const crrArr = arr.filter((e) => e.id === id);
  const tmpArr = arr.filter((e) => e.id !== id);

  if (type === 'up') {
    if (idx === 0) {
      return [
        ...tmpArr,
        ...crrArr
      ];
    }
    const tmp = [];
    for (let i = 0; i < tmpArr.length; i += 1) {
      if (i + 1 === idx) {
        tmp.push(...crrArr);
        tmp.push({ ...tmpArr[i] });
      } else {
        tmp.push({ ...tmpArr[i] });
      }
    }
    return tmp;
  }

  if (type === 'down') {
    if (idx === arr.length - 1) {
      return [
        ...crrArr,
        ...tmpArr
      ];
    }

    const tmp = [];
    for (let i = 0; i < tmpArr.length; i += 1) {
      if (i === idx) {
        tmp.push({ ...tmpArr[i] });
        tmp.push(...crrArr);
      } else {
        tmp.push({ ...tmpArr[i] });
      }
    }
    return tmp;
  }

  return null;
};

export const isEmpty = (param) =>
  Object.keys(param).length === 0;

export const strToBoolean = (flag) => {
  if (flag === 'true') return true;
  if (flag === 'false') return false;

  return null;
};
