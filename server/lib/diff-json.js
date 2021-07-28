export default function diff(obj1, obj2) {
  const result = {};
  if (Object.is(obj1, obj2)) {
       return undefined;
  }
  if (!obj2 || typeof obj2 !== 'object') {
      return obj2;
  }
  Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach((key) => {
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
          result[key] = obj2[key];
      }
      if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
          const value = diff(obj1[key], obj2[key]);
          if (value !== undefined) {
              result[key] = value;
          }
      }
  });
  return result;
}
