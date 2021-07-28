import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { CARRIER_NOTE_PERMISSIONS, CARRIER_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser, dummyCarrierIdForAssetSpec } from '../mock-data';
import { expectUnauthenticated, expectNoErrors, expectInsufficientPermissions } from '../utils';

const assetFragment = gql`
  fragment Asset on Asset {
    id
    fileUrl
    fileName
  }
`;

const carrierFragment = gql`
  fragment Carrier on Carrier {
    id
    mcNumber
    dotNumber
    companyName
    address
    city
    state
    zipcode
    phoneNumber
    fax
    firstContact
    secondContact
    insuranceExpires
    email
    contactOption
    needs1099
    ein
    ssn
    customField1
    customField2
    customField3
    customField4
  }
`;

const assetInput = {
  fileUrl: 'https://autobookpros.com/storage/demo.docx',
  fileName: 'dummy.docx'
};

const ATTACH_FILE_TO_CARRIER = gql`
  mutation AttachFileToCarrier(
    $id: ID!
    $category: CARRIER_FILE_CATEGORY!
    $asset: AssetInput!
  ) {
    attachFileToCarrier(id: $id, category: $category, asset: $asset) {
      ...Asset
    }
  }
  ${assetFragment}
`;

const driverFragment = gql`
  fragment Driver on Driver {
    id
    firstName
    lastName
    email
    phoneNumber
    carrier {
      ...Carrier
    }
  }
  ${carrierFragment}
`;

const noteFragment = gql`
  fragment Note on Note {
    id
    note
    addedBy {
      id
    }
  }
`;

const CREATE_CARRIER = gql`
  mutation CreateCarrier($input: CreateCarrierInput!) {
    addCarrier(input: $input) {
      ...Carrier
    }
  }
  ${carrierFragment}
`;

const UPDATE_CARRIER = gql`
  mutation UpdateCarrier($id: ID!, $input: UpdateCarrierInput!) {
    updateCarrier(id: $id, input: $input) {
      ...Carrier
    }
  }
  ${carrierFragment}
`;

const ADD_DRIVER = gql`
  mutation AddDriver($carrierId: ID!, $input: CreateDriverInput!) {
    addDriver(carrierId: $carrierId, input: $input) {
      ...Driver
    }
  }
  ${driverFragment}
`;

const DELETE_DRIVER = gql`
  mutation DeleteDriver($id: ID!) {
    deleteDriver(id: $id)
  }
`;

const UPDATE_DRIVER = gql`
  mutation UpdateDriver($id: ID!, $input: UpdateDriverInput!) {
    updateDriver(id: $id, input: $input) {
      ...Driver
    }
  }
  ${driverFragment}
`;

const ADD_INTERNAL_NOTE = gql`
  mutation AddCarrierNote($carrierId: ID!, $note: String!) {
    addCarrierNote(carrierId: $carrierId, note: $note) {
      ...Note
    }
  }
  ${noteFragment}
`;

const GET_CARRIER = gql`
  query GetCarrier($id: ID!) {
    carrier(id: $id) {
      ...Carrier
      drivers {
        id
      }
      notes {
        id
      }
    }
  }
  ${carrierFragment}
`;

const GET_CARRIERS = gql`
  query GetCarriers($search: String) {
    carriers(search: $search) {
      ...Carrier
    }
  }
  ${carrierFragment}
`;

// const CREATE_ORDER = gql`
//   mutation CreateOrder($input: CreateOrderInput!) {
//     createOrder(input: $input) {
//       id
//     }
//   }
// `;

// const DISPATCH_ORDER = gql`
//   mutation DispatchOrder($orderId: ID!, $input: CreateDispatchInput) {
//     dispatchOrder(orderId: $orderId, input: $input) {
//       id
//       order {
//         id
//       }
//       driver {
//         id
//       }
//       instructions
//       pickupDate
//       deliveryDate
//       status
//     }
//   }
// `;

const newCarrier = () => ({
  mcNumber: faker.random.number(),
  companyName: faker.company.companyName(),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.stateAbbr(),
  zipcode: '33196',
  phoneNumber: `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`,
  fax: '',
  firstContact: faker.name.firstName(),
  email: faker.internet.email(),
  contactOption: 'PHONE_ONLY',
  needs1099: false
});

const newDriver = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phoneNumber: `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`
});

describe('Carrier Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;
    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Get carriers should not allowed', async () => {
      const response = await testClient.query({
        query: GET_CARRIER,
        variables: {
          id: 0
        }
      });
      expectUnauthenticated(response);
    });

    test('Add carrier should not allowed', async () => {
      const driverInput = newDriver();
      const response = await testClient.mutate({
        mutation: ADD_DRIVER,
        variables: {
          carrierId: 0,
          input: driverInput
        }
      });
      expectUnauthenticated(response);
    });

    test('Update carrier should not allowed', async () => {
      const companyName = faker.company.companyName();
      const response = await testClient.mutate({
        mutation: UPDATE_CARRIER,
        variables: {
          id: 0,
          input: {
            companyName
          }
        }
      });
      expectUnauthenticated(response);
    });

    test('Add driver should not allowed', async () => {
      const driverInput = newDriver();

      const response = await testClient.mutate({
        mutation: ADD_DRIVER,
        variables: {
          carrierId: 0,
          input: driverInput
        }
      });
      expectUnauthenticated(response);
    });

    test('Update driver should not allowed', async () => {
      const firstName = faker.name.firstName();
      const response = await testClient.mutate({
        mutation: UPDATE_DRIVER,
        variables: {
          id: 0,
          input: {
            firstName
          }
        }
      });
      expectUnauthenticated(response);
    });

    test('Delete driver should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_DRIVER,
        variables: {
          id: 0
        }
      });
      expectUnauthenticated(response);
    });

    test('Add note should not allowed', async () => {
      const newNote = faker.lorem.sentence();

      const response = await testClient.mutate({
        mutation: ADD_INTERNAL_NOTE,
        variables: {
          carrierId: 0,
          note: newNote
        }
      });
      expectUnauthenticated(response);
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let carrierAId;
    let carrierBId;
    let driverAId;
    let driverB1Id;
    let noteId;
    const companyName = faker.company.companyName();

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Add carrier A: Success', async () => {
      const carrierInput = newCarrier();
      const response = await testClient.mutate({
        mutation: CREATE_CARRIER,
        variables: {
          input: carrierInput
        }
      });
      expectNoErrors(response);

      const carrier = response.data.addCarrier;
      expect(carrier).toMatchObject(carrierInput);

      carrierAId = carrier.id;
    });

    test('Add carrier B: Success', async () => {
      const carrierInput = newCarrier();
      const response = await testClient.mutate({
        mutation: CREATE_CARRIER,
        variables: {
          input: carrierInput
        }
      });
      expectNoErrors(response);

      const carrier = response.data.addCarrier;
      expect(carrier).toMatchObject(carrierInput);

      carrierBId = carrier.id;
    });

    test('Add driver A to carrier A: Success', async () => {
      const driverInput = newDriver();

      const response = await testClient.mutate({
        mutation: ADD_DRIVER,
        variables: {
          carrierId: carrierAId,
          input: driverInput
        }
      });

      expectNoErrors(response);

      const driver = response.data.addDriver;
      expect(driver).toMatchObject(driverInput);
      expect(driver.carrier.id).toBe(carrierAId);

      driverAId = driver.id;
    });

    test('Add driver B1 to carrier B: Success', async () => {
      const driverInput = newDriver();
      const response = await testClient.mutate({
        mutation: ADD_DRIVER,
        variables: {
          carrierId: carrierBId,
          input: driverInput
        }
      });

      expectNoErrors(response);

      const driver = response.data.addDriver;
      expect(driver).toMatchObject(driverInput);
      expect(driver.carrier.id).toBe(carrierBId);

      driverB1Id = driver.id;
    });

    test('Update driver A of carrier A: Success', async () => {
      const firstName = faker.name.firstName();
      const response = await testClient.mutate({
        mutation: UPDATE_DRIVER,
        variables: {
          id: driverAId,
          input: {
            firstName
          }
        }
      });
      expectNoErrors(response);

      const driver = response.data.updateDriver;
      expect(driver.firstName).toBe(firstName);
    });

    test('Delete driver B1 of carrier B: Success', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_DRIVER,
        variables: {
          id: driverB1Id
        }
      });
      expectNoErrors(response);

      const deletedId = response.data.deleteDriver;
      expect(deletedId).toBe(driverB1Id);
    });

    test('Add driver B2 to carrier B: Success', async () => {
      const driverInput = newDriver();
      const response = await testClient.mutate({
        mutation: ADD_DRIVER,
        variables: {
          carrierId: carrierBId,
          input: driverInput
        }
      });
      expectNoErrors(response);

      const driver = response.data.addDriver;
      expect(driver).toMatchObject(driverInput);
      expect(driver.carrier.id).toBe(carrierBId);
    });

    test('Add an internal note to carrier A: Success', async () => {
      const newNote = faker.lorem.sentence();

      const response = await testClient.mutate({
        mutation: ADD_INTERNAL_NOTE,
        variables: {
          carrierId: carrierAId,
          note: newNote
        }
      });
      expectNoErrors(response);

      const carrierNote = response.data.addCarrierNote;
      expect(carrierNote.note).toBe(newNote);
      expect(carrierNote.addedBy.id).toBe(adminMockUser.id);
      noteId = carrierNote.id;
    });

    // duplicated test case on order.
    // test('Create an order and the dispatch it to the created carrier: Success', async () => {
    //   const orderData = randomOrderData(0);

    //   let response = await testClient.mutate({
    //     mutation: CREATE_ORDER,
    //     variables: {
    //       input: orderData
    //     }
    //   });
    //   expect(response.errors).toBeUndefined();
    //   const order = response.data.createOrder;

    //   const dispatchData = {
    //     instructions: faker.lorem.sentence(),
    //     pickupDate: '2020-09-23',
    //     deliveryDate: '2020-09-30'
    //   };
    //   response = await testClient.mutate({
    //     mutation: DISPATCH_ORDER,
    //     variables: {
    //       orderId: order.id,
    //       input: {
    //         ...dispatchData,
    //         driverId
    //       }
    //     }
    //   });

    //   expect(response.errors).toBeUndefined();
    //   const dispatch = response.data.dispatchOrder;
    //   expect(dispatch).toMatchObject({
    //     ...dispatchData,
    //     driver: {
    //       id: driverId
    //     }
    //   });
    //   dispatchId = dispatch.id;
    // });

    test('Update carrier A: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_CARRIER,
        variables: {
          id: carrierAId,
          input: {
            companyName
          }
        }
      });
      expectNoErrors(response);

      const carrier = response.data.updateCarrier;
      expect(carrier.companyName).toBe(companyName);
    });

    test('Get carrier A: Success', async () => {
      const response = await testClient.query({
        query: GET_CARRIER,
        variables: {
          id: carrierAId
        }
      });
      expectNoErrors(response);

      const { carrier } = response.data;
      expect(carrier).toMatchObject({
        ...newCarrier,
        drivers: expect.arrayContaining([
          expect.objectContaining({ id: driverAId })
        ]),
        notes: expect.arrayContaining([expect.objectContaining({ id: noteId })])
      });
    });

    test('Get all carriers: Success', async () => {
      const response = await testClient.query({
        query: GET_CARRIERS
      });
      expectNoErrors(response);
    });

    test('Search carriers by company name', async () => {
      const response = await testClient.query({
        query: GET_CARRIERS,
        variables: {
          search: companyName
        }
      });
      expectNoErrors(response);

      const { carriers } = response.data;
      expect(carriers).toMatchObject(
        expect.arrayContaining(
          carriers.map(() => expect.objectContaining({ companyName }))
        )
      );
    });
  });

  describe('Authenticated but has necessary permissions missing', () => {
    test('View carriers: Not allowed', async () => {
      const testClient = createTestClient(
        createApolloServer(
          { user: adminMockUser },
          { omitPermissions: ['carrier.view'] }
        )
      );
      const response = await testClient.query({
        query: GET_CARRIERS
      });
      expectInsufficientPermissions(response);
    });

    test('Add a carrier: Not allowed', async () => {
      const testClient = createTestClient(
        createApolloServer(
          { user: adminMockUser },
          { omitPermissions: ['carrier.add_edit'] }
        )
      );

      const carrierInput = newCarrier();
      const response = await testClient.mutate({
        mutation: CREATE_CARRIER,
        variables: {
          input: carrierInput
        }
      });
      expectInsufficientPermissions(response);
    });
    // Duplicated test case with above case.
    // test('Dont have permissions to add a driver to a carrier', async () => { });

    test('Dont have permissions to add a note to a carrier', async () => {
      const user = removeUserPermission(
        adminMockUser,
        CARRIER_NOTE_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);
      const newNote = faker.lorem.sentence();

      const response = await testClient.mutate({
        mutation: ADD_INTERNAL_NOTE,
        variables: {
          carrierId: 0,
          note: newNote
        }
      });
      expectInsufficientPermissions(response);
    });

    test('Dont have permissions to attach a file to a carrier', async () => {
      const user = removeUserPermission(
        adminMockUser,
        CARRIER_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      const testClient = createTestClient(server);

      const response = await testClient.mutate({
        mutation: ATTACH_FILE_TO_CARRIER,
        variables: {
          id: dummyCarrierIdForAssetSpec,
          category: 'W9',
          asset: assetInput
        }
      });

      expectInsufficientPermissions(response);
    });
  });
});
