import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { MILEAGE_PRICING_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';

const LOAD_MILEAGE_PRICINGS = gql`
  query loadMileagePricings {
    mileagePricings {
      id
      minMileage
      maxMileage
      price
    }
  }
`;

const CREATE_MILEAGE_PRICING = gql`
  mutation createMileagePricing($pricingData: MileagePricingInput!) {
    createMileagePricing(pricingData: $pricingData) {
      id
      minMileage
      maxMileage
      price
    }
  }
`;

const UPDATE_MILEAGE_PRICING = gql`
  mutation updateMileagePricing(
    $mileagePricingID: ID!
    $pricingData: MileagePricingInput
  ) {
    updateMileagePricing(
      mileagePricingID: $mileagePricingID
      pricingData: $pricingData
    ) {
      id
      minMileage
      maxMileage
      price
    }
  }
`;

const DELETE_MILEAGE_PRICING = gql`
  mutation deleteMileagePricing($mileagePricingID: ID!) {
    deleteMileagePricing(mileagePricingID: $mileagePricingID) {
      id
    }
  }
`;

describe('Mileage Pricing Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Read should not allowed', async () => {
      const response = await testClient.query({ query: LOAD_MILEAGE_PRICINGS });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_MILEAGE_PRICING,
        variables: {
          pricingData: {
            minMileage: 10000,
            maxMileage: 20000,
            price: 1000
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_MILEAGE_PRICING,
        variables: {
          mileagePricingID: 12,
          pricingData: {
            minMileage: 2,
            maxMileage: 101,
            price: 201
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_MILEAGE_PRICING,
        variables: {
          mileagePricingID: 12
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let newMileagePricingID = null;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Read: Success', async () => {
      const response = await testClient.query({ query: LOAD_MILEAGE_PRICINGS });

      expect(response.errors).toBeUndefined();
    });

    test('Create: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_MILEAGE_PRICING,
        variables: {
          pricingData: {
            minMileage: 10000,
            maxMileage: 20000,
            price: 1000
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const mileagePricing = response.data.createMileagePricing;
      newMileagePricingID = mileagePricing.id;
      expect(parseInt(newMileagePricingID, 10)).toBeGreaterThan(0);
      expect(mileagePricing).toMatchObject({
        minMileage: 10000,
        maxMileage: 20000,
        price: 1000
      });
    });

    test('Update the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_MILEAGE_PRICING,
        variables: {
          mileagePricingID: newMileagePricingID,
          pricingData: {
            minMileage: 2,
            maxMileage: 101,
            price: 201
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const mileagePricing = response.data.updateMileagePricing;
      expect(mileagePricing).toMatchObject({
        id: `${newMileagePricingID}`,
        minMileage: 2,
        maxMileage: 101,
        price: 201
      });
    });

    test('Delete the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_MILEAGE_PRICING,
        variables: {
          mileagePricingID: newMileagePricingID
        }
      });

      expect(response.errors).toBeUndefined();
      expect(response.data.deleteMileagePricing.id).toBe(
        `${newMileagePricingID}`
      );
    });
  });

  describe('Authenticated but do not have permission for create or update', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        MILEAGE_PRICING_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_MILEAGE_PRICING,
        variables: {
          pricingData: {
            minMileage: 10000,
            maxMileage: 20000,
            price: 1000
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_MILEAGE_PRICING,
        variables: {
          mileagePricingID: 12,
          pricingData: {
            minMileage: 2,
            maxMileage: 101,
            price: 201
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
        MILEAGE_PRICING_PERMISSIONS.delete
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_MILEAGE_PRICING,
        variables: {
          mileagePricingID: 12
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });
  });
});
