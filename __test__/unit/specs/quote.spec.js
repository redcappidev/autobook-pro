import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import faker from 'faker';
import { expectUnauthenticated, QATestConsole } from '../utils';
import { createApolloServer } from '../apollo-server';
import {
  adminMockUser,
  manageMockUser1,
  parentStatus1,
  childStatus1,
  randomQuoteData,
  randomOrderData
} from '../mock-data';

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

const quoteFragment = gql`
  fragment Quote_quote on Quote {
    id
    shipper {
      firstName
      lastName
      email
      phone
    }
    origin {
      address
      zipcode
      city
      state
      email
    }
    destination {
      address
      zipcode
      city
      state
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
    }
    transport {
      availableDate
      deliveryDate
      basePrice
      sizeFee
      inopFee
      enclosedFee
      modified
      deposit
      fullPay
      totalPrice
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
  }
  ${quoteNoteFragment}
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
      basePrice
      sizeFee
      inopFee
      enclosedFee
      modified
      deposit
      fullPay
      totalPrice
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
  }
  ${quoteNoteFragment}
`;

const GET_QUOTE = gql`
  query Quote($id: ID!) {
    quote(id: $id) {
      ...Quote_quote
    }
  }
  ${quoteFragment}
`;

const GET_QUOTES = gql`
  query loadQuotes(
    $filterBy: LeadFilterBy
    $sortBy: LEAD_SORT_BY
    $cursor: PageCursor
  ) {
    quotes(filterBy: $filterBy, sortBy: $sortBy, cursor: $cursor) {
      data {
        ...Quote_quote
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
  ${quoteFragment}
`;

const CREATE_QUOTE = gql`
  mutation createQuote($input: CreateQuoteInput!) {
    createQuote(input: $input) {
      ...Quote_quote
    }
  }
  ${quoteFragment}
`;

const UPDATE_QUOTE = gql`
  mutation updateQuote($id: ID!, $input: UpdateQuoteInput!) {
    updateQuote(id: $id, input: $input) {
      ...Quote_quote
    }
  }
  ${quoteFragment}
`;

// const ADD_INTERNAL_NOTE = gql`
//   mutation addQuoteNote($input: CreateQuoteNoteInput) {
//     addQuoteNote(input: $input) {
//       ...Note
//     }
//   }
//   ${quoteNoteFragment}
// `;

// const VIEW_QUOTE_NOTE = gql`
//   mutation viewQuoteNote($noteId: ID!) {
//     viewQuoteNote(noteId: $noteId)
//   }
// `;

const CONVERT_TO_ORDER = gql`
  mutation ConvertToOrder($quoteId: ID!, $input: CreateOrderInput!) {
    convertToOrder(quoteId: $quoteId, input: $input) {
      ...Order_order
    }
  }
  ${orderFragment}
`;

const CONVERT_TO_QUOTE = gql`
  mutation ConvertToQuote($orderId: ID!) {
    convertToQuote(orderId: $orderId) {
      ...Quote_quote
    }
  }
  ${quoteFragment}
`;

describe('Quote Test Cases', () => {
  describe.skip('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Get quotes: Not allowed', async () => {
      const response = await testClient.query({ query: GET_QUOTES });
      expectUnauthenticated(response);
    });

    test('Create a quote: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_QUOTE,
        variables: {
          input: randomQuoteData(0)
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update a quote: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: 0,
          input: {
            assigneeId: manageMockUser1.id
          }
        }
      });
      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Place an order: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CONVERT_TO_ORDER,
        variables: {
          quoteId: 0,
          input: randomOrderData(0)
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('Update a quote status: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: 0,
          input: {
            parentStatusId: parentStatus1,
            childStatusId: childStatus1
          }
        }
      });
      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    const testQuoteData = [];
    // let newQuoteNoteId;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);

      // for (let index = 0; index < 7; index += 1) {
      //   testQuoteData.push(randomQuoteData(index));
      // }
    });

    test.skip('Create demo quote: Success', async () => {
      const quoteData = randomQuoteData(0);
      const response = await testClient.mutate({
        mutation: CREATE_QUOTE,
        variables: {
          input: quoteData
        }
      });

      QATestConsole(response.data);
    });

    test('Quote parent status update: Success', async () => {
      jest.setTimeout(1000 * 60 * 10);
      await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: '1132',
          input: {
            shipper: {
              email: 'rickywang432@gmail.com'
            },
            // parentStatusId: 155
            parentStatusId: 1
          }
        }
      });

      // QATestConsole(response.data);
      // QATestConsole(testClient);
    });

    test.skip('Create 7 demo quotes: Success', async () => {
      jest.setTimeout(1000 * 60 * 10);

      const promises = testQuoteData.map(async (quoteData, index) => {
        const response = await testClient.mutate({
          mutation: CREATE_QUOTE,
          variables: {
            input: quoteData
          }
        });

        return {
          ...response,
          index
        };
      });

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.errors).toBeUndefined();

        const quote = response.data.createQuote;
        expect(parseInt(quote.id, 10)).toBeGreaterThan(0);
        expect(quote).toMatchObject(testQuoteData[response.index]);
        expect(quote.assignee.id).toBe(adminMockUser.id);
        testQuoteData[response.index].id = quote.id;
      });
    });

    test.skip('Get a random quote that does not exist', async () => {
      const response = await testClient.query({
        query: GET_QUOTE,
        variables: {
          id: -1
        }
      });

      expect(response.errors).not.toBeFalsy();
      expect(response.errors[0].extensions.code).toBe('NOT_FOUND');
    });

    test.skip("Update the second quote's assignee: Success", async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: testQuoteData[1].id,
          input: {
            assigneeId: manageMockUser1.id
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const quote = response.data.updateQuote;
      expect(quote.assignee.id).toBe(`${manageMockUser1.id}`);
    });

    test.skip("Update the fifth quote's assignee: Success", async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: testQuoteData[4].id,
          input: {
            assigneeId: manageMockUser1.id
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const quote = response.data.updateQuote;
      expect(quote.assignee.id).toBe(`${manageMockUser1.id}`);
    });

    test.skip('Filter quotes by an assignee: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          filterBy: {
            assigneeId: manageMockUser1.id
          },
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { data, pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
      expect(data).toMatchObject(
        expect.arrayContaining(
          data.map(() =>
            expect.objectContaining({ assignee: { id: manageMockUser1.id } })
          )
        )
      );
    });

    test.skip('Update the parent and child status of the first quote: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: testQuoteData[0].id,
          input: {
            parentStatusId: parentStatus1,
            childStatusId: childStatus1
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const quote = response.data.updateQuote;
      expect(quote.parentStatus.id).toBe(`${parentStatus1}`);
      expect(quote.childStatus.id).toBe(`${childStatus1}`);
    });

    test.skip('Filter quotes by parent and child status: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          filterBy: {
            parentStatusId: parentStatus1,
            childStatusId: childStatus1
          },
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { data, pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
      expect(data).toMatchObject(
        expect.arrayContaining(
          data.map(() =>
            expect.objectContaining({
              parentStatus: { id: `${parentStatus1}` },
              childStatus: { id: `${childStatus1}` }
            })
          )
        )
      );
    });

    test.skip('Filter quotes by available date range: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          filterBy: {
            dateRange: {
              startDate: '2020-09-20',
              endDate: '2020-09-20'
            }
          },
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { data, pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
      expect(data).toMatchObject(
        expect.arrayContaining(
          data.map(() =>
            expect.objectContaining({
              transport: expect.objectContaining({
                availableDate: '2020-09-20'
              })
            })
          )
        )
      );
    });

    test.skip('Sort quotes by origin state & city: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          sortBy: 'ORIGIN',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
    });

    test.skip('Sort quotes by destination state & city: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          sortBy: 'DESTINATION',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
    });

    test.skip('Sort quotes by available date: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          sortBy: 'AVAILABLE_DATE_ASC',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
    });

    test.skip('Sort quotes by available date in descending order: Success', async () => {
      const response = await testClient.query({
        query: GET_QUOTES,
        variables: {
          sortBy: 'AVAILABLE_DATE_DESC',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const { pageInfo } = response.data.quotes;
      expect(pageInfo).toMatchObject({
        page: 0,
        size: 5
      });
    });

    test.skip('Update the third quote: Success', async () => {
      const shipperData = {
        firstName: faker.name.firstName(),
        email: faker.internet.email()
      };

      const response = await testClient.mutate({
        mutation: UPDATE_QUOTE,
        variables: {
          id: testQuoteData[2].id,
          input: {
            shipper: shipperData
          }
        }
      });

      expect(response.errors).toBeUndefined();
      const quote = response.data.updateQuote;
      expect(quote.shipper).toMatchObject(shipperData);
    });

    // test('Add an internal note to the sixth quote and then assign it to some users: Success',
    // async () => {
    //   const note = faker.lorem.sentence();
    //   const response = await testClient.mutate({
    //     mutation: ADD_INTERNAL_NOTE,
    //     variables: {
    //       input: {
    //         quoteId: testQuoteData[5].id,
    //         note,
    //         assignees: [adminMockUser.id, manageMockUser.id]
    //       }
    //     }
    //   });

    //   expect(response.errors).toBeUndefined();
    //   const internalNote = response.data.addQuoteNote;
    //   expect(internalNote.note).toBe(note);
    //   expect(internalNote.assignees).toMatchObject(
    //     expect.arrayContaining([
    //       expect.objectContaining({ user: { id: adminMockUser.id } }),
    //       expect.objectContaining({ user: { id: manageMockUser.id } })
    //     ])
    //   );
    //   newQuoteNoteId = internalNote.id;
    // });

    // test('View the assigned note: Success', async () => {
    //   const server = createApolloServer({ user: manageMockUser });
    //   const apolloClient = createTestClient(server);
    //   const response = await apolloClient.mutate({
    //     mutation: VIEW_QUOTE_NOTE,
    //     variables: {
    //       noteId: newQuoteNoteId
    //     }
    //   });

    //   expect(response.errors).toBeUndefined();
    // });

    test.skip('Convert the first quote to an order: Success', async () => {
      let response = await testClient.mutate({
        mutation: CONVERT_TO_ORDER,
        variables: {
          quoteId: testQuoteData[0].id,
          input: randomOrderData(0)
        }
      });

      expect(response.errors).toBeUndefined();

      response = await testClient.mutate({
        mutation: CONVERT_TO_QUOTE,
        variables: {
          orderId: testQuoteData[0].id
        }
      });

      expect(response.errors).toBeUndefined();
    });
  });
});
