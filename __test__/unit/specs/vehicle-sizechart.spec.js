import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { VEHICLE_SIZECHART_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser } from '../mock-data';

const LOAD_VEHICLE_SIZECHARTS = gql`
  query loadVehicleSizeCharts(
    $filter: VehicleSizeChartFilter
    $cursor: PageCursor
  ) {
    vehicleSizeCharts(filter: $filter, cursor: $cursor) {
      data {
        id
        year
        make
        model
        size {
          id
          name
        }
        search
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
`;

const CREATE_VEHICLE_SIZECHART = gql`
  mutation createVehicleSizeChart(
    $sizeChartData: VehicleSizeChartInput!
    $sizeID: Int!
  ) {
    createVehicleSizeChart(sizeChartData: $sizeChartData, sizeID: $sizeID) {
      id
      year
      make
      model
      size {
        id
        name
      }
      dontQuote
      search
    }
  }
`;

const UPDATE_VEHICLE_SIZECHART_SIZE = gql`
  mutation updateVehicleSizeChartSize($sizeChartID: ID!, $sizeID: Int!) {
    updateVehicleSizeChartSize(sizeChartID: $sizeChartID, sizeID: $sizeID) {
      id
      size {
        id
        name
      }
    }
  }
`;

const DELETE_VEHICLE_SIZECHART = gql`
  mutation deleteVehicleSizeChart($sizeChartID: ID!) {
    deleteVehicleSizeChart(sizeChartID: $sizeChartID) {
      id
    }
  }
`;

describe('Vehicle SizeChart Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Read should not allowed', async () => {
      const response = await testClient.query({
        query: LOAD_VEHICLE_SIZECHARTS,
        variables: {
          filter: {
            make: 'Audi',
            model: 'Coup'
          },
          cursor: {
            page: 1,
            size: 5
          }
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_VEHICLE_SIZECHART,
        variables: {
          sizeChartData: {
            make: 'Demo Make',
            model: 'Demo Model',
            dontQuote: false,
            search: ''
          },
          sizeID: 45
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_VEHICLE_SIZECHART_SIZE,
        variables: {
          sizeChartID: 23,
          sizeID: 49
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_VEHICLE_SIZECHART,
        variables: { sizeChartID: 23 }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let newSizeChartID = null;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Filter by make - Audi and model - Coup, Paginate the result: Success', async () => {
      const response = await testClient.query({
        query: LOAD_VEHICLE_SIZECHARTS,
        variables: {
          filter: {
            make: 'Audi',
            model: 'Coup'
          },
          cursor: {
            page: 1,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const vehicleSizeChart = response.data.vehicleSizeCharts.data[0];
      const { pageInfo } = response.data.vehicleSizeCharts;
      expect(vehicleSizeChart).toMatchObject({
        make: expect.stringMatching(/\w*Audi\w*/i),
        model: expect.stringMatching(/\w*Coup\w*/i)
      });
      expect(pageInfo).toMatchObject({
        page: 1,
        size: 5
      });
    });

    test('Create: Success', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_VEHICLE_SIZECHART,
        variables: {
          sizeChartData: {
            make: 'Demo Make',
            model: 'Demo Model',
            dontQuote: false,
            search: ''
          },
          sizeID: 45
        }
      });

      expect(response.errors).toBeUndefined();
      const vehicleSizeChart = response.data.createVehicleSizeChart;
      expect(parseInt(vehicleSizeChart.id, 10)).toBeGreaterThan(0);
      expect(vehicleSizeChart).toMatchObject({
        make: 'Demo Make',
        model: 'Demo Model',
        dontQuote: false,
        search: '',
        size: {
          id: '45'
        }
      });
      newSizeChartID = response.data.createVehicleSizeChart.id;
    });

    test('Update the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_VEHICLE_SIZECHART_SIZE,
        variables: {
          sizeChartID: newSizeChartID,
          sizeID: 49
        }
      });

      expect(response.errors).toBeUndefined();
      const vehicleSizeChart = response.data.updateVehicleSizeChartSize;
      expect(vehicleSizeChart).toMatchObject({
        id: `${newSizeChartID}`,
        size: {
          id: '49'
        }
      });
    });

    test('Delete the created one: Success', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_VEHICLE_SIZECHART,
        variables: { sizeChartID: newSizeChartID }
      });

      expect(response.errors).toBeUndefined();
      const vehicleSizeChart = response.data.deleteVehicleSizeChart;
      expect(vehicleSizeChart.id).toBe(`${newSizeChartID}`);
    });
  });

  describe('Authenticated but do not have permission for create or update', () => {
    let testClient;

    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        VEHICLE_SIZECHART_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Create should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_VEHICLE_SIZECHART,
        variables: {
          sizeChartData: {
            make: 'Demo Make',
            model: 'Demo Model',
            dontQuote: false,
            search: ''
          },
          sizeID: 45
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });

    test('Update should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_VEHICLE_SIZECHART_SIZE,
        variables: {
          sizeChartID: 23,
          sizeID: 49
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
        VEHICLE_SIZECHART_PERMISSIONS.delete
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test('Delete should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_VEHICLE_SIZECHART,
        variables: { sizeChartID: 23 }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe(
        'INSUFFICIENT_PERMISSIONS'
      );
    });
  });
});
