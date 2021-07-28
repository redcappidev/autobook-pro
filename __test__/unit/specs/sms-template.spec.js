import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { SMS_TEMPLATE_PERMISSIONS } from '@server/constants';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';
import { expectUnauthenticated, expectNoErrors, expectInsufficientPermissions, QATestConsole } from '../utils';

const READ_SMS_TEMPLATES = gql`
  query readSMSTemplates {
    smsTemplates {
      id
      name
      script
      placeholders
    }
  }
`;

const CREATE_SMS_TEMPLATE = gql`
  mutation createSMSTemplate($input: CreateSMSTemplateInput!) {
    createSMSTemplate(input: $input) {
      id
      name
    }
  }
`;

describe('SMS Template Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Read should not allowed', async () => {
      const response = await testClient.query({ query: READ_SMS_TEMPLATES });

      expectUnauthenticated(response);
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_SMS_TEMPLATE,
        variables: {
          input: {
            name: faker.name.title(),
            script: faker.lorem.text()
          }
        }
      });

      expectUnauthenticated(response);
    });
  });
  describe('Authenticated as admin', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Read: Success', async () => {
      const response = await testClient.query({ query: READ_SMS_TEMPLATES });
      QATestConsole(response);

      expectNoErrors(response);
    });

    test('Create: Success', async () => {
      const templateName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_SMS_TEMPLATE,
        variables: {
          input: {
            name: templateName,
            script: faker.lorem.text()
          }
        }
      });

      expectNoErrors(response);
      const smsTemplate = response.data.createSMSTemplate;
      expect(parseInt(smsTemplate.id, 10)).toBeGreaterThan(0);
      expect(smsTemplate.name).toBe(templateName);
    });
  });

  describe('Authenticated but do not have permission for create or update', () => {
    let testClient;
    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        SMS_TEMPLATE_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Create SMS Template: Premission Required', async () => {
      const templateName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_SMS_TEMPLATE,
        variables: {
          input: {
            name: templateName,
            script: faker.lorem.text()
          }
        }
      });
      expectInsufficientPermissions(response);
    });
  });

  describe('Authenticated but do not have permission for delete', () => { });
});
