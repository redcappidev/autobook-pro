import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { PRICING_EXCEPTION_PERMISSIONS } from '@server/constants';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';

const LOAD_PRICING_EXCEPTIONS = gql`
  query loadPricingExceptions(
    $filter: PricingExceptionsFilter
    $cursor: PageCursor
  ) {
    pricingExceptions(filter: $filter, cursor: $cursor) {
      data {
        id
        originState
        originCity
        destState
        destCity
        rules {
          originRadius
          destRadius
          price
        }
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
`;

const CREATE_PRICING_EXCEPTION = gql`
  mutation createPricingException(
    $originState: String
    $originCity: String
    $destState: String
    $destCity: String
    $pricingRules: [PricingRuleInput]
  ) {
    createPricingException(
      originState: $originState
      originCity: $originCity
      destState: $destState
      destCity: $destCity
      pricingRules: $pricingRules
    ) {
      id
      originState
      originCity
      destState
      destCity
      rules {
        originRadius
        destRadius
        price
      }
    }
  }
`;

const UPDATE_PRICING_RULE = gql`
  mutation updatePricingRule(
    $pricingExceptionID: ID!
    $priority: Int
    $pricingRule: PricingRuleInput
  ) {
    updatePricingRule(
      pricingExceptionID: $pricingExceptionID
      priority: $priority
      pricingRule: $pricingRule
    ) {
      id
      originState
      originCity
      destState
      destCity
      rules {
        originRadius
        destRadius
        price
      }
    }
  }
`;

const DELETE_PRICING_EXCEPTION = gql`
  mutation deletePricingException($pricingExceptionID: ID!) {
    deletePricingException(pricingExceptionID: $pricingExceptionID) {
      id
    }
  }
`;

describe('Pricing Exception Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Read should not allowed', async () => {
      const response = await testClient.query({
        query: LOAD_PRICING_EXCEPTIONS,
        variables: {
          filter: {}
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_PRICING_EXCEPTION,
        variables: {
          originState: 'AL',
          originCity: 'Demo',
          destState: 'FL',
          destCity: 'Demo',
          pricingRules: [
            {
              originRadius: 100,
              destRadius: 100,
              price: 1000
            },
            {
              originRadius: 200,
              destRadius: 200,
              price: 1000
            }
          ]
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_PRICING_RULE,
        variables: {
          pricingExceptionID: 23,
          priority: 1,
          pricingRule: {
            originRadius: 50,
            destRadius: 50,
            price: 350
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_PRICING_EXCEPTION,
        variables: {
          pricingExceptionID: 23
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let newPricingException = null;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Filter by originState, originCity and destState, Paginate the result: Success', async () => {
      const response = await testClient.query({
        query: LOAD_PRICING_EXCEPTIONS,
        variables: {
          filter: {
            originState: 'AL',
            originCity: 'Birmingham',
            destState: 'FL'
          },
          cursor: {
            page: 1,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const pricingException = response.data.pricingExceptions.data[0];
      const { pageInfo } = response.data.pricingExceptions;
      expect(pricingException).toMatchObject({
        originState: 'AL',
        originCity: 'Birmingham',
        destState: 'FL'
      });
      expect(pageInfo).toMatchObject({
        page: 1,
        size: 5
      });
    });

    test('Create: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_PRICING_EXCEPTION,
        variables: {
          originState: 'AL',
          originCity: 'Demo',
          destState: 'FL',
          destCity: 'Demo',
          pricingRules: [
            {
              originRadius: 100,
              destRadius: 100,
              price: 1000
            },
            {
              originRadius: 200,
              destRadius: 200,
              price: 1000
            }
          ]
        }
      });

      expect(response.errors).toBeUndefined();
      newPricingException = response.data.createPricingException.id;
      const pricingException = response.data.createPricingException;
      expect(parseInt(pricingException.id, 10)).toBeGreaterThan(0);
      expect(pricingException).toMatchObject({
        originState: 'AL',
        originCity: 'Demo',
        destState: 'FL',
        destCity: 'Demo'
      });
      expect(pricingException.rules).toEqual(
        expect.arrayContaining([
          {
            originRadius: 100,
            destRadius: 100,
            price: 1000
          },
          {
            originRadius: 200,
            destRadius: 200,
            price: 1000
          }
        ])
      );
    });

    test('Update the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_PRICING_RULE,
        variables: {
          pricingExceptionID: newPricingException,
          priority: 1,
          pricingRule: {
            originRadius: 50,
            destRadius: 50,
            price: 350
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const pricingException = response.data.updatePricingRule;
      expect(pricingException.id).toBe(`${newPricingException}`);
      expect(pricingException.rules[0]).toMatchObject({
        originRadius: 50,
        destRadius: 50,
        price: 350
      });
    });

    test('Update the pricing rule with priority of 4 must throw BAD_USER_INPUT error', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_PRICING_RULE,
        variables: {
          pricingExceptionID: newPricingException,
          priority: 4,
          pricingRule: {
            originRadius: 50,
            destRadius: 50,
            price: 350
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('BAD_USER_INPUT');
    });

    test('Delete the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_PRICING_EXCEPTION,
        variables: {
          pricingExceptionID: newPricingException
        }
      });

      expect(response.errors).toBeUndefined();
      const pricingException = response.data.deletePricingException;
      expect(pricingException.id).toBe(`${newPricingException}`);
    });
  });

  describe('Authenticated but do not have permission for create or update', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        PRICING_EXCEPTION_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_PRICING_EXCEPTION,
        variables: {
          originState: 'AL',
          originCity: 'Demo',
          destState: 'FL',
          destCity: 'Demo',
          pricingRules: [
            {
              originRadius: 100,
              destRadius: 100,
              price: 1000
            },
            {
              originRadius: 200,
              destRadius: 200,
              price: 1000
            }
          ]
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_PRICING_RULE,
        variables: {
          pricingExceptionID: 23,
          priority: 1,
          pricingRule: {
            originRadius: 50,
            destRadius: 50,
            price: 350
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });
  });

  describe('Authenticated but do not have permission for delete', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        PRICING_EXCEPTION_PERMISSIONS.delete
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_PRICING_EXCEPTION,
        variables: {
          pricingExceptionID: 23
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });
  });
});
