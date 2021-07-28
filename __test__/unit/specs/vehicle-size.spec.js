import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { VEHICLE_SIZE_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';

const LOAD_VEHICLE_SIZES = gql`
  query loadVehicleSizes {
    vehicleSizes {
      id
      name
      rateBump
      flatBump
    }
  }
`;

const CREATE_VEHICLE_SIZE = gql`
  mutation createVehicleSize($name: String) {
    createVehicleSize(name: $name) {
      id
      name
    }
  }
`;

const UPDATE_VEHICLE_SIZE_PRICING = gql`
  mutation updateVehicleSizePricing(
    $vehicleSizeID: ID!
    $rateBump: Int
    $flatBump: Int
  ) {
    updateVehicleSizePricing(
      vehicleSizeID: $vehicleSizeID
      rateBump: $rateBump
      flatBump: $flatBump
    ) {
      id
      name
      rateBump
      flatBump
    }
  }
`;

const DELETE_VEHICLE_SIZE = gql`
  mutation deleteVehicleSize($vehicleSizeID: ID!) {
    deleteVehicleSize(vehicleSizeID: $vehicleSizeID) {
      id
    }
  }
`;

describe('Vehicle Size Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Read should not allowed', async () => {
      const response = await testClient.query({ query: LOAD_VEHICLE_SIZES });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_VEHICLE_SIZE,
        variables: { name: 'Demo Size' }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_VEHICLE_SIZE_PRICING,
        variables: {
          vehicleSizeID: 23,
          rateBump: -16
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_VEHICLE_SIZE,
        variables: { vehicleSizeID: 23 }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let newVehicleSizeID = null;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Read: Success', async () => {
      const response = await testClient.query({ query: LOAD_VEHICLE_SIZES });

      expect(response.errors).toBeUndefined();
    });

    test('Create: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_VEHICLE_SIZE,
        variables: { name: 'Demo Size' }
      });

      expect(response.errors).toBeUndefined();
      newVehicleSizeID = response.data.createVehicleSize.id;
      const vehicleSize = response.data.createVehicleSize;
      expect(parseInt(vehicleSize.id, 10)).toBeGreaterThan(0);
      expect(vehicleSize.name).toBe('Demo Size');
    });

    test('Update the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_VEHICLE_SIZE_PRICING,
        variables: {
          vehicleSizeID: newVehicleSizeID,
          rateBump: -16
        }
      });

      expect(response.errors).toBeUndefined();
      const vehicleSize = response.data.updateVehicleSizePricing;
      expect(vehicleSize).toMatchObject({
        id: `${newVehicleSizeID}`,
        rateBump: -16
      });
    });

    test('Delete the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_VEHICLE_SIZE,
        variables: { vehicleSizeID: newVehicleSizeID }
      });

      expect(response.errors).toBeUndefined();
      const vehicleSize = response.data.deleteVehicleSize;
      expect(vehicleSize.id).toBe(`${newVehicleSizeID}`);
    });
  });

  describe('Authenticated but do not have permission for create or update', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        VEHICLE_SIZE_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_VEHICLE_SIZE,
        variables: { name: 'Demo Size' }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_VEHICLE_SIZE_PRICING,
        variables: {
          vehicleSizeID: 23,
          rateBump: -16
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
        VEHICLE_SIZE_PERMISSIONS.delete
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_VEHICLE_SIZE,
        variables: { vehicleSizeID: 23 }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });
  });
});
