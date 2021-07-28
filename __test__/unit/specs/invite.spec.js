import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { INVITE_USER_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';
import {
  expectNoErrors,
  expectInsufficientPermissions,
  expectUnauthenticated
} from '../utils';

const inviteFragment = gql`
  fragment Invite on Invite {
    id
    email
    roleId
    encryption
    expired
  }
`;

const GET_INVITES = gql`
  query loadInvites(
    $filterBy: LeadFilterBy
    $sortBy: LEAD_SORT_BY
    $cursor: PageCursor
  ) {
    invites(filterBy: $filterBy, sortBy: $sortBy, cursor: $cursor) {
      data {
        ...Invite
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
  ${inviteFragment}
`;

const CREATE_INVITE = gql`
  mutation createInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      ...Invite
    }
  }
  ${inviteFragment}
`;

const GET_INVITE = gql`
  query loadInvite($inviteId: ID!) {
    invite(id: $inviteId) {
      ...Invite
    }
  }
  ${inviteFragment}
`;

const ACTIVATE_INVITE = gql`
  mutation activateInvite($inviteId: ID!) {
    activateInvite(inviteId: $inviteId) {
      ...Invite
    }
  }
  ${inviteFragment}
`;

const DEACTIVATE_INVITE = gql`
  mutation deactivateInvite($inviteId: ID!) {
    deactivateInvite(inviteId: $inviteId) {
      ...Invite
    }
  }
  ${inviteFragment}
`;

describe('Invite User Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;
    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Get inivites: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: GET_INVITE,
        variables: {
          inviteId: 0
        }
      });
      expectUnauthenticated(response);
    });

    test('Create an invites: Not allowed', async () => {
      const email = faker.internet.email();
      const response = await testClient.mutate({
        mutation: CREATE_INVITE,
        variables: {
          input: {
            email,
            roleId: 1
          }
        }
      });
      expectUnauthenticated(response);
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let testInviteData;
    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Create an invites: Success', async () => {
      const email = faker.internet.email();
      const response = await testClient.mutate({
        mutation: CREATE_INVITE,
        variables: {
          input: {
            email,
            roleId: 1
          }
        }
      });

      expectNoErrors(response);
      const invite = response.data.createInvite;
      expect(invite.email).toBe(email);
      testInviteData = invite;
    });

    test('Get all invites', async () => {
      const response = await testClient.query({
        query: GET_INVITES,
        variables: {
          filterBy: {
            expired: false
          },
          sortBy: 'ID',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });
      expectNoErrors(response);
    });
    test('Get an invite: Success', async () => {
      const response = await testClient.mutate({
        mutation: GET_INVITE,
        variables: {
          inviteId: testInviteData.id
        }
      });
      expectNoErrors(response);
      const { invite } = response.data;
      expect(invite.email).toBe(testInviteData.email);
    });
    test('Activate an inivite: Success', async () => {
      const response = await testClient.mutate({
        mutation: ACTIVATE_INVITE,
        variables: {
          inviteId: testInviteData.id
        }
      });
      expectNoErrors(response);
      const invite = response.data.activateInvite;
      expect(invite.expired).toBe(false);
    });
    test('Deactivate an inivite: Success', async () => {
      const response = await testClient.mutate({
        mutation: DEACTIVATE_INVITE,
        variables: {
          inviteId: testInviteData.id
        }
      });
      expectNoErrors(response);
      const invite = response.data.deactivateInvite;
      expect(invite.expired).toBe(true);
    });
  });

  describe('Authenticated but has necessary permissions missing', () => {
    test('(No permissions to view an inivtes) View an invite: Not allowed', async () => {
      const user = removeUserPermission(
        adminMockUser,
        INVITE_USER_PERMISSIONS.view
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);

      const response = await testClient.mutate({
        mutation: GET_INVITE,
        variables: {
          inviteId: 0
        }
      });
      expectInsufficientPermissions(response);
    });
    test('(No permissions to create an invite) Create an invite: Not allowed', async () => {
      const user = removeUserPermission(
        adminMockUser,
        INVITE_USER_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);
      const email = faker.internet.email();

      const response = await testClient.mutate({
        mutation: CREATE_INVITE,
        variables: {
          input: {
            email,
            roleId: 1
          }
        }
      });
      expectInsufficientPermissions(response);
    });
  });
});
