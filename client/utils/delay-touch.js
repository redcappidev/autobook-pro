export default ($v, touchMap) => {
  $v.$reset();
  if (touchMap.has($v)) {
    clearTimeout(touchMap.get($v));
  }
  touchMap.set($v, setTimeout($v.$touch, 2000));
};
