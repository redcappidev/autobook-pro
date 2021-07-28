import gql from 'graphql-tag';
import faker from 'faker';
import { ORDER_PERMISSIONS } from '@server/constants';
import { removeUserPermission } from '@server/lib/permission-helpers';
import { createTestClient } from 'apollo-server-testing';
import { createApolloServer } from '../apollo-server';
import { expectUnauthenticated, expectNoErrors, expectInsufficientPermissions } from '../utils';
import {
  adminMockUser,
  manageMockUser1,
  randomOrderData,
  parentStatus1
} from '../mock-data';

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
const orderLinkFragment = gql`
  fragment OrderLink on OrderLink {
    id
    encryption
    type
    expired
  }
`;

const termsFragment = gql`
  fragment Terms on TermsAndConditions {
    accepted
    eName
    eSign
  }
`;

const quoteNoteFragment = gql`
  fragment Note on Note {
    id
    note
    assignees {
      user {
        id
      }
      viewed
      viewedAt
    }
  }
`;

const orderFragment = gql`
  fragment Order_order on Order {
    id
    shipper {
      firstName
      lastName
      companyName
      address
      address2
      email
      phone
      phone2
      mobile
      fax
      city
      state
      zipcode
    }
    origin {
      name
      companyName
      address
      address2
      zipcode
      city
      state
      phone
      phone2
      mobile
      email
    }
    destination {
      name
      companyName
      address
      address2
      zipcode
      city
      state
      phone
      phone2
      mobile
      email
    }
    vehicles {
      year
      make
      model
      operable
      size {
        id
        name
      }
      color
      plate
      state
      vin
      lot
    }
    transport {
      availableDate
      deliveryDate
    }
    assignee {
      id
    }
    parentStatus {
      id
    }
    childStatus {
      id
    }
    internalNotes {
      ...Note
    }
    followup {
      id
    }
    billingInfo {
      billingAddress {
        firstName
        lastName
        email
        address
        city
        state
        zipcode
      }
      creditCard {
        cardNumber
        expirationDate
      }
    }
    dispatch {
      id
    }
    terms {
      ...Terms
    }
  }
  ${quoteNoteFragment},
  ${termsFragment}
`;

const GET_ORDERS = gql`
  query loadOrders(
    $filterBy: LeadFilterBy
    $sortBy: LEAD_SORT_BY
    $cursor: PageCursor
  ) {
    orders(filterBy: $filterBy, sortBy: $sortBy, cursor: $cursor) {
      data {
        ...Order_order
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
  ${orderFragment}
`;

const CREATE_ORDER = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...Order_order
    }
  }
  ${orderFragment}
`;

const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      ...Order_order
    }
  }
  ${orderFragment}
`;

const SET_BILLING_INFO_TO_ORDER = gql`
  mutation setBillingInfoToOrder(
    $orderId: ID!
    $input: BillingInformationInput
  ) {
    setBillingInfoToOrder(orderId: $orderId, input: $input) {
      id
    }
  }
`;

const GET_EXPERIENCED_CARRIERS = gql`
  mutation getExperiencedCarriers($orderId: ID!) {
    getExperiencedCarriers(orderId: $orderId) {
      ...Carrier
    }
  }
  ${carrierFragment}
`;

const UPDATE_TRANSPORT = gql`
  mutation updateTransport($orderId: ID!, $input: UpdateTransportInput) {
    updateTransport(orderId: $orderId, input: $input) {
      ...Order_order
    }
  }
  ${orderFragment}
`;

const SEND_SHIPPER_PAYMENT_EMAIL = gql`
  mutation sendShipperPaymentEmail($orderId: ID!) {
    sendShipperPaymentEmail(orderId: $orderId) {
      ...OrderLink
    }
  }
  ${orderLinkFragment}
`;

const UPDATE_TERMS_MANUALLY = gql`
  mutation updateTermsManually($orderId: ID!, $input: TermsAndConditionsInput) {
    updateTermsManually(orderId: $orderId, input: $input) {
      ...Order_order
    }
  }
  ${orderFragment}
`;

const CHARGE_ORDER = gql`
  mutation chargeOrder($orderId: ID!, $amount: Int!, $note: String!) {
    chargeOrder(orderId: $orderId, amount: $amount, note: $note) {
      id
      order {
        ...Order_order
      }
      amount
      note
      transactionId
    }
  }
  ${orderFragment}
`;

const SEND_TERMS_AND_CONDITIONS = gql`
  mutation sendTermsAndConditions($orderId: ID!) {
    sendTermsAndConditions(orderId: $orderId) {
      ...OrderLink
    }
  }
  ${orderLinkFragment}
`;

const DISPATCH_ORDER = gql`
  mutation dispatchOrder($orderId: ID!, $input: CreateDispatchInput) {
    dispatchOrder(orderId: $orderId, input: $input) {
      id
      driver {
        id
      }
      instructions
      pickupDate
      deliveryDate
      status
    }
  }
`;

describe('Order Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;
    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test.skip('Get orders: Not allowed', async () => {
      const response = await testClient.query({ query: GET_ORDERS });
      expectUnauthenticated(response);
    });

    test.skip('Create an order: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_ORDER,
        variables: {
          input: randomOrderData(0)
        }
      });
      expectUnauthenticated(response);
    });

    test.skip('Set billing information to an order: Not allowed', async () => {
      const zipCode = faker.address.zipCode();
      const address = faker.address.streetAddress();
      const city = faker.address.city();
      const state = faker.address.state();
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const response = await testClient.mutate({
        mutation: SET_BILLING_INFO_TO_ORDER,
        variables: {
          orderId: 0,
          input: {
            billingAddress: {
              firstName,
              lastName,
              email,
              address,
              city,
              state,
              zipcode: zipCode
            },
            creditCard: {
              cardNumber: '5424000000000015',
              exprMonth: '02',
              exprYear: '22',
              cvv: 900
            }
          }
        }
      });
      expectUnauthenticated(response);
    });

    test.skip('Charge an order: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CHARGE_ORDER,
        variables: {
          orderId: 0,
          amount: 1000,
          note: 'Test - Charge an order: Not allowed'
        }
      });
      expectUnauthenticated(response);
    });

    test.skip('Dispatch an order: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: DISPATCH_ORDER,
        variables: {
          orderId: 0,
          input: {}
        }
      });
      expectUnauthenticated(response);
    });
  });
  describe('Authenticated as admin', () => {
    let testClient;
    let testOrderData;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test.skip('Create order A: Success', async () => {
      testOrderData = randomOrderData(0);

      const response = await testClient.mutate({
        mutation: CREATE_ORDER,
        variables: {
          input: { ...testOrderData }
        }
      });

      expect(response.errors).toBeUndefined();
      const order = response.data.createOrder;
      expect(parseInt(order.id, 10)).toBeGreaterThan(0);
      expect(order.assignee.id).toBe(adminMockUser.id);
      testOrderData.id = order.id;
      expect(order.shipper).toMatchObject(
        testOrderData.shipper
      );
    });

    test.skip('Update order A: Success', async () => {
      const { id, transport, ...orderData } = testOrderData;
      const response = await testClient.mutate({
        mutation: UPDATE_ORDER,
        variables: {
          id,
          input: {
            ...orderData,
            parentStatusId: parentStatus1,
            assigneeId: manageMockUser1.id
          }
        }
      });
      const transportResponse = await testClient.mutate({
        mutation: UPDATE_TRANSPORT,
        variables: {
          orderId: id,
          input: {
            deliveryDate: '2020-10-13'
          }
        }
      });

      expect(response.errors).toBeUndefined();
      expect(transportResponse.errors).toBeUndefined();
      const order = transportResponse.data.updateTransport;
      expect(order.assignee.id).toBe(`${manageMockUser1.id}`);
      const { availableDate, deliveryDate } = order.transport;
      expect(new Date(deliveryDate).getTime()).toBeGreaterThan(new Date(availableDate).getTime());
    });

    test.skip('Get carriers that has experience in the smiliar transport like this order: Success', async () => {
      const response = await testClient.mutate({
        mutation: GET_EXPERIENCED_CARRIERS,
        variables: {
          orderId: testOrderData.id
        }
      });
      expect(response.errors).toBeUndefined();
    });

    test('Add payment information manually to order A: Success', async () => {
      const zipCode = '76308';
      // const zipCode = faker.address.zipCode();
      const address = '';
      // const address = faker.address.streetAddress();
      const city = 'Wichta Falls';
      // const city = faker.address.city();
      const state = 'TX';
      // const state = faker.address.state();
      const email = 'bot1@bot.com';
      // const email = faker.internet.email();
      const firstName = 'bot';
      // const firstName = faker.name.firstName();
      const lastName = 'jan';
      // const lastName = faker.name.lastName();

      const response = await testClient.mutate({
        mutation: SET_BILLING_INFO_TO_ORDER,
        variables: {
          orderId: '1204',
          input: {
            billingAddress: {
              firstName,
              lastName,
              email,
              address,
              city,
              state,
              zipcode: zipCode
            },
            creditCard: {
              cardNumber: '5424000000000015',
              exprMonth: '02',
              exprYear: '22',
              cvv: 900
            }
          }
        }
      });
      expect(response.errors).toBeUndefined();
      // const order = response.data.setBillingInfoToOrder;
      // expect(order.billingInfo.billingAddress.email).toBe(email);
    });

    test.skip('Send shipper payment email: Success', async () => {
      const response = await testClient.mutate({
        mutation: SEND_SHIPPER_PAYMENT_EMAIL,
        variables: {
          orderId: testOrderData.id
        }
      });
      expectNoErrors(response);
      const orderLink = response.data.sendShipperPaymentEmail;
      expect(orderLink.type).toBe('BILLING');
    });

    test.skip('Must accept terms and conditions in order to charge order A', async () => {
      const responseUpdateTerms = await testClient.mutate({
        mutation: UPDATE_TERMS_MANUALLY,
        variables: {
          orderId: testOrderData.id,
          input: {
            accepted: false,
            eName: '',
            eSign: ''
          }
        }
      });
      expectNoErrors(responseUpdateTerms);
      const { updateTermsManually } = responseUpdateTerms.data;
      expect(updateTermsManually.terms.accepted).toBe(false);

      const responseChargeOrder = await testClient.mutate({
        mutation: CHARGE_ORDER,
        variables: {
          orderId: updateTermsManually.id,
          amount: 1000,
          note: 'Must accept terms and conditions in order to charge order'
        }
      });
      expectNoErrors(responseChargeOrder);
      const { chargeOrder } = responseChargeOrder.data;
      expect(chargeOrder).toBe(null);
    });

    test.skip('Send terms and conditions: Success', async () => {
      await testClient.mutate({
        mutation: UPDATE_TERMS_MANUALLY,
        variables: {
          orderId: testOrderData.id,
          input: {
            accepted: true,
            eName: '',
            eSign: ''
          }
        }
      });

      const response = await testClient.mutate({
        mutation: SEND_TERMS_AND_CONDITIONS,
        variables: {
          orderId: testOrderData.id
        }
      });

      expectNoErrors(response);
      const orderLink = response.data.sendTermsAndConditions;
      expect(orderLink.type).toBe('TERMS');
    });

    test.skip('Charge order A: Success', async () => {
      const response = await testClient.mutate({
        mutation: CHARGE_ORDER,
        variables: {
          orderId: testOrderData.id,
          amount: 1000,
          note: 'Test - Charge order A: Success'
        }
      });

      expectNoErrors(response);
      const { chargeOrder } = response.data;
      expect(chargeOrder.order.id).toBe(testOrderData.id);
      expect(chargeOrder.amount).toBe(1000);
    });

    test.skip('Dispatch order: Success', async () => {
      const responseExperiencedCarrier = await testClient.mutate({
        mutation: GET_EXPERIENCED_CARRIERS,
        variables: {
          orderId: testOrderData.id
        }
      });

      expectNoErrors(responseExperiencedCarrier);
      const { getExperiencedCarriers } = responseExperiencedCarrier.data;

      const driverId = getExperiencedCarriers.length > 0
        ? getExperiencedCarriers[0].drivers[0].id : 10;

      const response = await testClient.mutate({
        mutation: DISPATCH_ORDER,
        variables: {
          orderId: testOrderData.id,
          input: {
            driverId,
            instructions: 'Test - Dispatch order: Success',
            pickupDate: '2020-10-01',
            deliveryDate: '2020-10-05'
          }
        }
      });
      expectNoErrors(response);
      const { dispatchOrder } = response.data;
      expect(parseInt(dispatchOrder.driver.id, 10)).toBe(driverId);
    });
  });
  describe('Authenticated but has necessary permissions missing', () => {
    let testClient;
    beforeAll(() => {
      const user = removeUserPermission(
        adminMockUser,
        ORDER_PERMISSIONS.addOrEdit
      );
      const server = createApolloServer({ user });
      testClient = createTestClient(server);
    });

    test.skip('AddOrEdit should not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_ORDER,
        variables: {
          input: randomOrderData(0)
        }
      });

      expectInsufficientPermissions(response);
    });
  });
});
