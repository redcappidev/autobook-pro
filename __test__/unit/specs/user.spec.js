import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { createApolloServer } from '../apollo-server';
import { adminMockUser, manageMockUser } from '../mock-data';
import {
  expectNoErrors,
  expectInsufficientPermissions
  // QATestConsole
} from '../utils';

const userFragment = gql`
  fragment User on User {
    id
    firstName
    lastName
    email
    roleId
    activate
  }
`;

const inviteFragment = gql`
  fragment Invite on Invite {
    id
    email
    roleId
    encryption
    expired
  }
`;

// const permissionFragment = gql`
//   fragment Permission on Permission {
//     name
//     variables {
//       view
//       addOrEdit
//       delete
//     }
//   }
// `;

const GET_USERS = gql`
  query loadUsers (
    $filterBy: LeadFilterBy
    $sortBy: LEAD_SORT_BY
    $cursor: PageCursor
  ) {
    users(filterBy: $filterBy, sortBy: $sortBy, cursor: $cursor) {
      data {
        ...User
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
  ${userFragment}
`;

const GET_USER = gql`
  query loadUser($userId: ID!) {
    user(id: $userId) {
      ...User
    }
  }
  ${userFragment}
`;

const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile($userId: ID!, $input: UpdateProfileInput!) {
    updateUserProfile(userId: $userId, input: $input) {
      ...User
    }
  }
  ${userFragment}
`;

const CHANGE_USER_ROLE = gql`
  mutation changeUserRole($userId: ID!, $roleId: PositiveInt!) {
    changeUserRole(userId: $userId, roleId: $roleId) {
      ...User
    }
  }
  ${userFragment}
`;

const DEACTIVATE_USER = gql`
  mutation deactivateUser($userId: ID!) {
    deactivateUser(userId: $userId) {
      ...User
    }
  }
  ${userFragment}
`;

const ACTIVATE_USER = gql`
  mutation activateUser($userId: ID!) {
    activateUser(userId: $userId) {
      ...User
    }
  }
  ${userFragment}
`;

const INVITE_USER = gql`
  mutation inviteUser($input: CreateInviteInput!) {
    inviteUser(input: $input) {
      ...Invite
    }
  }
  ${inviteFragment}
`;

const ACCEPT_INVITE = gql`
  mutation acceptInvite($encryption: String!, $input: CreateUserInput) {
    acceptInvite(encryption: $encryption, input: $input) {
      ...User
    }
  }
  ${userFragment}
`;

const UPDATE_PROFILE_SELF = gql`
  mutation updateProfileSelf($input: UpdateProfileInput!) {
    updateProfileSelf(input: $input) {
      ...User
    }
  }
  ${userFragment}
`;

// const GET_PERMISSIONS_LIST = gql`
//   mutation permissions() {
//     permissions() {
//       ...Permission
//     }
//   }
//   ${permissionFragment}
// `;

// const GET_PERMISSIONS_BY_ROLE = gql`
//   mutation getPermissionsByRole($roleId: ID!) {
//     getPermissionsByRole(roleId: $roleId) {
//       ...Permission
//     }
//   }
//   ${permissionFragment}
// `;

// const ADD_PERMISSION = gql`
//   mutation addPermission($roleId: ID!, $input: PermissionInput!) {
//     addPermission(roleId: $roleId, input: $input) {
//       ...Permission
//     }
//   }
//   ${permissionFragment}
// `;

// const REMOVE_PERMISSION = gql`
//   mutation removePermission($roleId: ID!, $input: PermissionInput!) {
//     removePermission(roleId: $roleId, input: $input) {
//       ...Permission
//     }
//   }
//   ${permissionFragment}
// `;

describe('User Test Cases', () => {
  describe('Authenticated as user', () => {
    test('Accept Invitation', async () => {
      const server = createApolloServer();
      const testClient = createTestClient(server);
      const encryption = '1xvba6kg1n19h1';
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const response = await testClient.mutate({
        mutation: ACCEPT_INVITE,
        variables: {
          encryption,
          input: {
            firstName,
            lastName
          }
        }
      });
      expectNoErrors(response);
    });
  });
  describe('Authenticated as user', () => {
    let testClient;
    beforeAll(() => {
      const server = createApolloServer({ user: manageMockUser });
      testClient = createTestClient(server);
    });

    test('Update his/her\'s profile allow', async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email();
      const response = await testClient.mutate({
        mutation: UPDATE_PROFILE_SELF,
        variables: {
          input: {
            firstName,
            lastName,
            email
          }
        }
      });
      expectNoErrors(response);
      const user = response.data.updateProfileSelf;
      expect(user.email).toBe(email);
    });
    test('Destroy his/her\'s profile allow', async () => { });
    test('Get all users does not allow', async () => {
      const response = await testClient.query({
        query: GET_USERS,
        variables: {
          filterBy: {
            roleId: 5,
            firstName: '%J%'
          },
          sortBy: 'EMAIL',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });
      expectInsufficientPermissions(response);
    });
    test('Invite user does not allow ', async () => {
      const email = faker.internet.email();
      const response = await testClient.mutate({
        mutation: INVITE_USER,
        variables: {
          input: {
            email,
            roleId: 2
          }
        }
      });
      expectInsufficientPermissions(response);
    });
    test('Update custom user does not allow ', async () => {
      const userId = '23';
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email();

      const response = await testClient.mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: {
          userId,
          input: {
            firstName,
            lastName,
            email
          }
        }
      });
      expectInsufficientPermissions(response);
    });
    test('Deactivate custom user does not allow ', async () => {
      const userId = '23';
      const response = await testClient.mutate({
        mutation: DEACTIVATE_USER,
        variables: {
          userId
        }
      });
      expectInsufficientPermissions(response);
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Get all user\'s profile allow: Success', async () => {
      const response = await testClient.query({
        query: GET_USERS,
        variables: {
          filterBy: {
            roleId: 5,
            firstName: '%J%'
          },
          sortBy: 'EMAIL',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });
      expectNoErrors(response);
    });
    test('Get custom user\'s profile allow: Success', async () => {
      const userId = '26';
      const response = await testClient.mutate({
        mutation: GET_USER,
        variables: {
          userId
        }
      });
      expectNoErrors(response);
      const { user } = response.data;
      expect(user.id).toBe(userId);
    });
    test('Update custom user\'s profile allow: Success', async () => {
      const userId = '23';
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email();

      const response = await testClient.mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: {
          userId,
          input: {
            firstName,
            lastName,
            email
          }
        }
      });
      expectNoErrors(response);
      const user = response.data.updateUserProfile;
      expect(user.id).toBe(userId);
    });
    test('Change custom user\'s role allow: Success', async () => {
      const userId = '23';
      const response = await testClient.mutate({
        mutation: CHANGE_USER_ROLE,
        variables: {
          userId,
          roleId: 3
        }
      });
      expectNoErrors(response);
      const user = response.data.changeUserRole;
      expect(user.id).toBe(userId);
    });
    test('Deactivate custom user\'s profile allow: Success', async () => {
      const userId = '23';
      const response = await testClient.mutate({
        mutation: DEACTIVATE_USER,
        variables: {
          userId
        }
      });
      expectNoErrors(response);
      const user = response.data.deactivateUser;
      expect(user.activate).toBe(false);
    });
    test('Activate custom user\'s profile allow: Success', async () => {
      const userId = '25';
      const response = await testClient.mutate({
        mutation: ACTIVATE_USER,
        variables: {
          userId
        }
      });
      expectNoErrors(response);
      const user = response.data.activateUser;
      expect(user.activate).toBe(true);
    });
    test('Invite user allow: Success', async () => {
      const email = faker.internet.email();
      const response = await testClient.mutate({
        mutation: INVITE_USER,
        variables: {
          input: {
            email,
            roleId: 2
          }
        }
      });
      expectNoErrors(response);
      const { inviteUser } = response.data;
      expect(inviteUser.email).toBe(email);
    });
    // test('Get all permissions', async () => {
    //   const response = await testClient.mutate({
    //     mutation: GET_PERMISSIONS_LIST,
    //     variables: {
    //       userId: '23'
    //     }
    //   });

    //   QATestConsole(response);
    // });
    // test('Get permissions by user role', async () => {
    //   const roleId = '3';
    //   const response = await testClient.mutate({
    //     mutation: GET_PERMISSIONS_BY_ROLE,
    //     variables: {
    //       roleId
    //     }
    //   });

    //   expectNoErrors(response);
    // });
    // test('Add permission to user', async () => {
    //   const roleId = 3;
    //   const response = await testClient.mutate({
    //     mutation: ADD_PERMISSION,
    //     variables: {
    //       roleId,
    //       input: {}
    //     }
    //   });

    //   expectNoErrors(response);
    //   const role = response.data.addPermission;
    //   expect(role.id).toBe(roleId);
    // });

    // test('Remove permission to user', async () => {
    //   const roleId = '3';
    //   const response = await testClient.mutate({
    //     mutation: REMOVE_PERMISSION,
    //     variables: {
    //       roleId,
    //       input: {}
    //     }
    //   });
    //   expectNoErrors(response);
    //   const role = response.data.addPermission;
    //   expect(role.id).toBe(roleId);
    // });
  });
});
