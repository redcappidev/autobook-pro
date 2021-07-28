import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { createApolloServer } from '../apollo-server';
import {
  adminMockUser,
  dummyQuoteIdForAssetSpec,
  dummyCarrierIdForAssetSpec
} from '../mock-data';
import {
  expectUnauthenticated,
  expectNoErrors,
  expectInsufficientPermissions
} from '../utils';

const assetFragment = gql`
  fragment Asset on Asset {
    id
    fileUrl
    fileName
  }
`;

const ATTACH_FILE_TO_QUOTE = gql`
  mutation AttachFileToQuote($id: ID!, $asset: AssetInput!) {
    attachFileToQuote(id: $id, asset: $asset) {
      ...Asset
    }
  }
  ${assetFragment}
`;

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

const assetInput = {
  fileUrl: 'https://autobookpros.com/storage/demo.docx',
  fileName: 'dummy.docx'
};

const attachFileToQuote = (client) =>
  client.mutate({
    mutation: ATTACH_FILE_TO_QUOTE,
    variables: {
      id: dummyQuoteIdForAssetSpec,
      asset: assetInput
    }
  });

const attachFileToCarrier = (client) =>
  client.mutate({
    mutation: ATTACH_FILE_TO_CARRIER,
    variables: {
      id: dummyCarrierIdForAssetSpec,
      category: 'W9',
      asset: assetInput
    }
  });

describe('Asset Test Case', () => {
  describe('Non-authenticated', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Attach a file to a quote: Not allowed', async () => {
      const response = await attachFileToQuote(testClient);
      expectUnauthenticated(response);
    });

    test('Attach a file to a carrier: Not allowed', async () => {
      const response = await attachFileToQuote(testClient);
      expectUnauthenticated(response);
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;

    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Attach a file to a quote: Success', async () => {
      const response = await attachFileToQuote(testClient);
      expectNoErrors(response);

      const asset = response.data.attachFileToQuote;
      expect(asset).toMatchObject(assetInput);
    });

    test('Attach a file to a carrier: Success', async () => {
      const response = await attachFileToCarrier(testClient);
      expectNoErrors(response);

      const asset = response.data.attachFileToCarrier;
      expect(asset).toMatchObject(assetInput);
    });
  });

  describe('Authenticated but has necessary permission missing', () => {
    test('Attach a file to a quote: Not allowed', async () => {
      const testClient = createTestClient(
        createApolloServer(
          { user: adminMockUser },
          { omitPermissions: ['quote.add_edit'] }
        )
      );
      const response = await attachFileToQuote(testClient);
      expectInsufficientPermissions(response);
    });

    test('Attach a file to a carrier: Not allowed', async () => {
      const testClient = createTestClient(
        createApolloServer(
          { user: adminMockUser },
          { omitPermissions: ['carrier.add_edit'] }
        )
      );
      const response = await attachFileToCarrier(testClient);
      expectInsufficientPermissions(response);
    });
  });
});
