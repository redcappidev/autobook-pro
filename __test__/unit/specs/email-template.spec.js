import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { EMAIL_TEMPLATE_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';
import { expectUnauthenticated, expectNoErrors, expectInsufficientPermissions } from '../utils';

const emailTemplateFragment = gql`
  fragment EmailTemplate on EmailTemplate {
    id
    name
    emailFrom
    emailFromName
    replyTo
    emailSubject
    emailBcc
    htmlBody
    placeholders
  }
`;

const READ_EMAIL_TEMPLATES = gql`
  query readEmailTemplates {
    emailTemplates {
      ...EmailTemplate
    }
  }
  ${emailTemplateFragment}
`;

const CREATE_EMAIL_TEMPLATE = gql`
  mutation createEmailTemplate($input: CreateEmailTemplateInput) {
    createEmailTemplate(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_EMAIL_TEMPLATE = gql`
  mutation updateEmailTemplate($templateId: ID!, $input: UpdateEmailTemplateInput) {
    updateEmailTemplate(templateId: $templateId, input: $input) {
      ...EmailTemplate
    }
  }
  ${emailTemplateFragment}
`;

const DELETE_EMAIL_TEMPLATE = gql`
  mutation deleteEmailTemplate($templateId: ID!) {
    deleteEmailTemplate(templateId: $templateId) 
  }
`;
describe('Email Template Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Get email templates should not allowed', async () => {
      const response = await testClient.query({ query: READ_EMAIL_TEMPLATES });

      expectUnauthenticated(response);
    });

    test('Create an email template should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_EMAIL_TEMPLATE,
        variables: {
          input: {
            name: faker.name.title(),
            emailFrom: faker.internet.email(),
            emailFromName: faker.name.title(),
            replyTo: faker.internet.email(),
            emailSubject: faker.lorem.sentence(),
            htmlBody: faker.lorem.text()
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

    test('Get email templates: Success', async () => {
      const response = await testClient.query({ query: READ_EMAIL_TEMPLATES });
      expectNoErrors(response);
    });

    test('Create email template: Success', async () => {
      const templateName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_EMAIL_TEMPLATE,
        variables: {
          input: {
            name: templateName,
            emailFrom: faker.internet.email(),
            emailFromName: faker.name.title(),
            replyTo: faker.internet.email(),
            emailSubject: faker.lorem.sentence(),
            htmlBody: faker.lorem.text()
          }
        }
      });

      expectNoErrors(response);
      const emailTemplate = response.data.createEmailTemplate;
      expect(parseInt(emailTemplate.id, 10)).toBeGreaterThan(0);
      expect(emailTemplate.name).toBe(templateName);
    });
  });

  describe('Authenticated but has necessary permissions missing', () => {
    test('Dont have permission to get email templates', async () => {
      const user = removeUserPermission(
        adminMockUser,
        EMAIL_TEMPLATE_PERMISSIONS.view
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);

      const response = await testClient.query({ query: READ_EMAIL_TEMPLATES });
      expectInsufficientPermissions(response);
    });

    test('Dont have permission to create an email template', async () => {
      const user = removeUserPermission(
        adminMockUser,
        EMAIL_TEMPLATE_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);
      const templateName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_EMAIL_TEMPLATE,
        variables: {
          input: {
            name: templateName,
            emailFrom: faker.internet.email(),
            emailFromName: faker.name.title(),
            replyTo: faker.internet.email(),
            emailSubject: faker.lorem.sentence(),
            htmlBody: faker.lorem.text()
          }
        }
      });
      expectInsufficientPermissions(response);
    });

    test('Dont have permission to update an email template', async () => {
      const user = removeUserPermission(
        adminMockUser,
        EMAIL_TEMPLATE_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);
      const templateName = faker.name.title();

      const response = await testClient.mutate({
        mutation: UPDATE_EMAIL_TEMPLATE,
        variables: {
          templateId: 1,
          input: {
            name: templateName,
            emailFrom: faker.internet.email(),
            emailFromName: faker.name.title(),
            replyTo: faker.internet.email(),
            emailSubject: faker.lorem.sentence(),
            htmlBody: faker.lorem.text()
          }
        }
      });
      expectInsufficientPermissions(response);
    });

    test('Dont have permission to delete an email template', async () => {
      const user = removeUserPermission(
        adminMockUser,
        EMAIL_TEMPLATE_PERMISSIONS.delete
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);

      const response = await testClient.mutate({
        mutation: DELETE_EMAIL_TEMPLATE,
        variables: {
          templateId: 1
        }
      });

      expectInsufficientPermissions(response);
    });
  });
});
