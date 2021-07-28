export default (bootFiles = [], context) => {
  bootFiles.forEach(async (bootFile) => {
    // eslint-disable-next-line
    const bootModule = await require(`./${bootFile}`);
    bootModule.default(context);
  });
};
