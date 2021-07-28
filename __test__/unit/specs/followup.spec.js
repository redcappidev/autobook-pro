import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { createApolloServer } from '../apollo-server';
import { adminMockUser, demoQuoteId1 } from '../mock-data';

const CREATE_FOLLOWUP_TYPE = gql`
  mutation CreateFollowupType($input: CreateFollowupTypeInput!) {
    createFollowupType(input: $input) {
      id
      name
      smsTemplate {
        id
      }
    }
  }
`;

const CREATE_FOLLOWUP = gql`
  mutation CreateFollowup($input: CreateFollowupInput!) {
    createFollowup(input: $input) {
      id
      type {
        id
      }
      notext
      nofurther
      note
      followupOn
      quote {
        id
      }
    }
  }
`;

describe('Followup Test Cases', () => {
  describe('Non-authenticated', () => {
    test('Create followup should not allowed', async () => {});

    test('Delete followup should not allowed', async () => {});
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let followupTypeId;
    let followupId;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Create followup A type: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_FOLLOWUP_TYPE,
        variables: {
          input: {
            name: faker.lorem.word()
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const followupType = response.data.createFollowupType;
      followupTypeId = followupType.id;
    });

    test('Create followup A: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_FOLLOWUP,
        variables: {
          input: {
            quoteId: demoQuoteId1,
            typeId: followupTypeId,
            note: faker.lorem.text(),
            followupOn: '2020-09-20'
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const followup = response.data.createFollowup;
      followupId = followup.id;
    });

    test('Create followup B but followup A should be revoked: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_FOLLOWUP,
        variables: {
          input: {
            quoteId: demoQuoteId1,
            typeId: followupTypeId,
            note: faker.lorem.text(),
            followupOn: '2020-09-22'
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const followup = response.data.createFollowup;
      expect(followup.id).toBe(followupId);
    });

    test('Delete followup B: Success', async () => {});
  });

  describe('Authenticated but has necessary permissions missing', () => {
    test('(No permissions to create a followup) Create a followup: Not allowed', async () => {});

    test('(No permissions to delete a followup) Delete a followup: Not allowed', async () => {});

    test('(No permissions to view followups) View followups: Not allowed', async () => {});
  });
});
