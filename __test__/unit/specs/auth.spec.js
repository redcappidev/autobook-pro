const request = require('supertest');
const app = require('@server/app').default;

describe('Authentication using local strategy', () => {
  const agent = request.agent(app);
  const signupEmail = `${Date.now()}.mock@example.com`;
  const signupPassword = 'mockpassword';

  test('Login with fake credential should send 401 code', (done) => {
    const fakeUser = 'imnotuser@example.com';
    const fakePwd = 'pwdincorrect';

    agent
      .post('/login-callback')
      .send({
        email: fakeUser,
        password: fakePwd,
        authType: 'login'
      })
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  test('Signup without password confirmation should send 401 code', (done) => {
    const email = `${Date.now()}.mock@example.com`;
    const password = 'mockpassword';

    agent
      .post('/login-callback')
      .send({
        email,
        password,
        authType: 'signup',
        firstName: 'Jest',
        lastName: 'User'
      })
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  test('Signup should succeed', (done) => {
    agent
      .post('/login-callback')
      .send({
        email: signupEmail,
        password: signupPassword,
        passwordConfirm: signupPassword,
        authType: 'signup',
        firstName: 'Jest',
        lastName: 'User',
        roleName: 'Support'
      })
      .set('Accept', 'application/json')
      .expect(302, done);
  });

  test('Logout', (done) => {
    agent.get('/logout-callback').expect(302, done);
  });

  test('Login should succeed if the previous signup was successful', (done) => {
    agent
      .post('/login-callback')
      .send({
        email: signupEmail,
        password: signupPassword,
        authType: 'login'
      })
      .set('Accept', 'application/json')
      .expect(302, done);
  });
});
