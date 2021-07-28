import has from 'lodash/has';

function getter(data, path) {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.map((d) => getter(d, path)).flat();
  }

  const pathComponents = path.split('.');
  if (pathComponents.length > 0) {
    const key = pathComponents.shift();
    if (has(data, key)) {
      const value = data[key];
      const restPath = pathComponents.join('.');

      if (pathComponents.length > 0) {
        return getter(value, restPath);
      }

      return [value];
    }
  }

  return [];
}

export default getter;
