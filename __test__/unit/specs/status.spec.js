import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { STATUS_TYPES, STATUS_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser, demoEmailTemplateId } from '../mock-data';
import { QATestConsole } from '../utils';

const statusFragment = gql`
  fragment Status_status on Status {
    id
    name
    parent {
      id
      name
    }
    emailTemplate {
      id
      name
    }
    smsTemplate {
      id
      name
    }
  }
`;

const READ_PARENT_STATUSES = gql`
  query readParentStatuses($type: StatusType!) {
    parentStatuses(type: $type) {
      ...Status_status
      childrenCount
      children {
        id
        name
      }
    }
  }
  ${statusFragment}
`;

const READ_CHILD_STATUSES = gql`
  query readChildStatuses($parentId: ID!) {
    childStatuses(parentId: $parentId) {
      ...Status_status
    }
  }
  ${statusFragment}
`;

const READ_STATUS = gql`
  query readStatus($id: ID!) {
    status(id: $id) {
      ...Status_status
      childrenCount
      children {
        ...Status_status
      }
    }
  }
  ${statusFragment}
`;

const CREATE_STATUS = gql`
  mutation createStatus($input: CreateStatusInput!) {
    createStatus(input: $input) {
      ...Status_status
    }
  }
  ${statusFragment}
`;

const UPDATE_STATUS = gql`
  mutation updateStatus($id: ID!, $input: UpdateStatusInput) {
    updateStatus(id: $id, input: $input) {
      ...Status_status
    }
  }
  ${statusFragment}
`;

const DELETE_STATUS = gql`
  mutation deleteStatus($id: ID!) {
    deleteStatus(id: $id) {
      ...Status_status
    }
  }
  ${statusFragment}
`;

describe('Status Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Get statuses should not allowed', async () => {
      const response = await testClient.query({
        query: READ_PARENT_STATUSES,
        variables: { type: STATUS_TYPES.quote }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Create status should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_STATUS,
        variables: {
          input: {
            type: STATUS_TYPES.quote,
            name: faker.name.title()
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update status should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_STATUS,
        variables: {
          id: 2,
          input: {
            name: faker.name.title(),
            emailTemplateId: null
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Delete status should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_STATUS,
        variables: {
          id: 2
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let parentStatusId;
    const childStatuses = [];

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Get all parent statuses: Success', async () => {
      const response = await testClient.query({
        query: READ_PARENT_STATUSES,
        variables: { type: STATUS_TYPES.quote }
      });
      QATestConsole(response);
      expect(response.errors).toBeUndefined();
    });

    test('Create a parent status without email or sms template: Success', async () => {
      const statusName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_STATUS,
        variables: {
          input: {
            type: STATUS_TYPES.quote,
            name: statusName
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const status = response.data.createStatus;
      expect(parseInt(status.id, 10)).toBeGreaterThan(0);
      expect(status.name).toBe(statusName);
    });

    test('Create a parent status with an email template: Success', async () => {
      const statusName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_STATUS,
        variables: {
          input: {
            type: STATUS_TYPES.quote,
            name: statusName,
            emailTemplateId: demoEmailTemplateId
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const status = response.data.createStatus;
      expect(parseInt(status.id, 10)).toBeGreaterThan(0);
      expect(status.name).toBe(statusName);
      expect(status.emailTemplate.id).toBe(demoEmailTemplateId);
      parentStatusId = status.id;
    });

    test('Create a child status: Success', async () => {
      const statusName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_STATUS,
        variables: {
          input: {
            parentId: parentStatusId,
            type: STATUS_TYPES.quote,
            name: statusName
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const status = response.data.createStatus;
      expect(parseInt(status.id, 10)).toBeGreaterThan(0);
      expect(status).toMatchObject({
        name: statusName,
        parent: {
          id: parentStatusId
        }
      });
      childStatuses.push(status);
    });

    test('Create another child status: Success', async () => {
      const statusName = faker.name.title();

      const response = await testClient.mutate({
        mutation: CREATE_STATUS,
        variables: {
          input: {
            parentId: parentStatusId,
            type: STATUS_TYPES.quote,
            name: statusName
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const status = response.data.createStatus;
      expect(parseInt(status.id, 10)).toBeGreaterThan(0);
      expect(status).toMatchObject({
        name: statusName,
        parent: {
          id: parentStatusId
        }
      });
      childStatuses.push(status);
    });

    test('Read the created child statuses: Success', async () => {
      const response = await testClient.query({
        query: READ_CHILD_STATUSES,
        variables: { parentId: parentStatusId }
      });

      expect(response.errors).toBeUndefined();
      expect(response.data.childStatuses).toEqual(
        expect.arrayContaining(childStatuses)
      );
    });

    test('Read the parent status of the child statuses: Success', async () => {
      const response = await testClient.query({
        query: READ_STATUS,
        variables: { id: parentStatusId }
      });

      expect(response.errors).toBeUndefined();
      const { status } = response.data;
      expect(status.childrenCount).toBe(childStatuses.length);
      expect(status.children).toEqual(expect.arrayContaining(childStatuses));
    });

    test('Update the parent status: Success', async () => {
      const statusName = faker.name.title();
      const response = await testClient.mutate({
        mutation: UPDATE_STATUS,
        variables: {
          id: parentStatusId,
          input: {
            name: statusName,
            emailTemplateId: null
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const status = response.data.updateStatus;
      expect(status).toMatchObject({
        name: statusName,
        emailTemplate: null
      });
    });

    test('Delete the parent status without deleting the child statuses: Fail', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_STATUS,
        variables: {
          id: parentStatusId
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('FORBIDDEN');
    });

    test('Delete the child statuses first and then delete the parent status: Success', async () => {
      let response = await testClient.mutate({
        mutation: DELETE_STATUS,
        variables: {
          id: childStatuses[0].id
        }
      });
      expect(response.errors).toBeUndefined();
      response = await testClient.mutate({
        mutation: DELETE_STATUS,
        variables: {
          id: childStatuses[1].id
        }
      });
      expect(response.errors).toBeUndefined();
      response = await testClient.mutate({
        mutation: DELETE_STATUS,
        variables: {
          id: parentStatusId
        }
      });
      expect(response.errors).toBeUndefined();
    });
  });

  describe('Authenticated but has necessary permissions missing', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        STATUS_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Dont have permissions to create a status', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_STATUS,
        variables: {
          input: {
            type: STATUS_TYPES.quote,
            name: faker.name.title()
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });

    test('Dont have permissions to update a status', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_STATUS,
        variables: {
          id: 2,
          input: {
            name: faker.name.title(),
            emailTemplateId: null
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });

    test('Dont have permission to delete a status', async () => { });
  });

  describe('Authenticated but do not have permission for delete', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        STATUS_PERMISSIONS.delete
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_STATUS,
        variables: {
          id: 2
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });
  });
});
