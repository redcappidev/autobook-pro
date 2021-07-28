import request from 'supertest';
import faker from 'faker';
import app from '@server/app';

describe('Webhook for lead providers', () => {
  const agent = request.agent(app);

  test('It should send a lead to autobook pro', (done) => {
    // This webhook handler usually takes more than 5 seconds which is
    // the timeout limit in default jest configuration.
    jest.setTimeout(1000 * 60 * 10);

    agent
      .post('/leads/iRello')
      .send({
        'First Name': faker.name.firstName(),
        'Last Name': faker.name.lastName(),
        'Customer Email': faker.internet.email(),
        'Customer Phone': '608-770-0229',
        'Origin City': 'Birmingham',
        'Origin State': 'AL',
        'Origin Zip': 35217,
        'Destination City': 'Fort Myers',
        'Destination State': 'FL',
        'Destination Zip': 33912,
        'Vehicle Count': 1,
        'Vehicle Type': faker.vehicle.type(),
        'Vehicle Year': 2007,
        'Vehicle Make': faker.vehicle.manufacturer(),
        'Vehicle Model': faker.vehicle.model(),
        'Vehicle Condition': faker.random.boolean(),
        'Move Date': faker.date.soon().toISOString()
      })
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
