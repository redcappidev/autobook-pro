export const expectUnauthenticated = (response) => {
  expect(response.errors).not.toBeFalsy();
  expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
};

export const expectNoErrors = (response) => {
  expect(response.errors).toBeUndefined();
};

export const expectInsufficientPermissions = (response) => {
  expect(response.errors).not.toBeFalsy();
  expect(response.errors[0].extensions.code).toBe('INSUFFICIENT_PERMISSIONS');
};

export const QATestConsole = (data) =>
  console.log(JSON.stringify(data, null, 2));
