import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
// import faker from 'faker';
// import { REPORT_PERMISSIONS } from '@server/constants';
// import { removeUserPermission } from '@server/lib/permission-helpers';
import { createApolloServer } from '../apollo-server';
import { adminMockUser, customReport } from '../mock-data';
import { expectNoErrors, QATestConsole, expectUnauthenticated } from '../utils';

const userFragment = gql`
  fragment User on User {
    id
    firstName
    lastName
  }
`;

const reportMatrixFragment = gql`
  fragment Report_matrix on ReportMatrix {
    area
    filters {
      name
      filter
    }
  }
`;

const sharedWithFragment = gql`
  fragment SharedWith on SharedWith {
    reportId
    user {
      ...User
    }
  }
  ${userFragment}
`;

const reportFragment = gql`
  fragment Report_report on Report {
    id
    userId
    name
    matrix {
      ...Report_matrix
    }
    sharedWith {
      ...SharedWith
    }
  }
  ${sharedWithFragment}
  ${reportMatrixFragment}
`;

const CREATE_REPORT = gql`
  mutation createReport($input: CreateReportInput!) {
    createReport(input: $input) {
      ...Report_report
    }
  }
  ${reportFragment}
`;

const GET_REPORTS = gql`
  query loadReports(
    $filterBy: ReportFilterBy
    $sortBy: REPORT_SORT_BY
    $cursor: PageCursor
  ) {
    reports (filterBy: $filterBy, sortBy: $sortBy, cursor: $cursor) {
      data {
        ...Report_report
      }
      pageInfo {
        page
        size
        total
      }
    }
  }
  ${reportFragment}
`;

const GET_REPORT = gql`
  query loadReport($reportId: ID!) {
    report(id: $reportId) {
      ...Report_report
    }
  }
  ${reportFragment}
`;

const UPDATE_REPORT = gql`
  mutation updateReport($reportId: ID!, $input: UpdateReportInput) {
    updateReport(reportId: $reportId, input: $input) {
      id
    }
  }
`;

const DELETE_REPORT = gql`
  mutation deleteReport($reportId: ID!) {
    deleteReport(reportId: $reportId)
  }
`;

const FETCH_DATA = gql`
  query fetchData(
    $reportId: ID!, 
    $dateRange: ReportDataDateRange
    $cursor: PageCursor
  ) {
    fetchData(reportId: $reportId, dateRange: $dateRange, cursor: $cursor) {
      data
      pageInfo {
        page
        size
        total
      }
    }
  }
`;

describe('Report Test Cases', () => {
  describe('Non-authenticated', () => {
    let testClient;
    beforeAll(() => {
      const server = createApolloServer();
      testClient = createTestClient(server);
    });

    test('Get all reports: Not allowed', async () => {
      const response = await testClient.query({
        query: GET_REPORTS,
        variables: {
          filterBy: {
            name: 'Test'
          },
          sortBy: 'ID',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });
      expectUnauthenticated(response);
    });

    test('Create a report: Not allowed', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_REPORT,
        variables: {
          input: {
            name: 'Test Report',
            userId: parseInt(adminMockUser.id, 10),
            matrix: {
              area: customReport[1].area, // Quote
              filters: [
                customReport[1].fields[0],
                customReport[1].fields[1],
                customReport[1].fields[2],
                customReport[1].fields[3],
                customReport[1].fields[4],
                customReport[1].fields[5],
                customReport[1].fields[6],
                customReport[1].fields[7],
                customReport[1].fields[8],
                customReport[1].fields[9]
              ]
            }
          }
        }
      });
      expectUnauthenticated(response);
    });
  });

  describe('Authenticated as admin', () => {
    let testClient;
    let testReport;
    beforeAll(() => {
      const server = createApolloServer({ user: adminMockUser });
      testClient = createTestClient(server);
    });

    test('Create report: Succes', async () => {
      const response = await testClient.mutate({
        mutation: CREATE_REPORT,
        variables: {
          input: {
            name: 'Test Report',
            userId: parseInt(adminMockUser.id, 10),
            matrix: {
              area: customReport[1].area, // Quote
              filters: [
                customReport[1].fields[0],
                customReport[1].fields[1],
                customReport[1].fields[2],
                customReport[1].fields[3],
                customReport[1].fields[4],
                customReport[1].fields[5],
                customReport[1].fields[6],
                customReport[1].fields[7],
                customReport[1].fields[8],
                customReport[1].fields[9]
              ]
            }
          }
        }
      });
      expectNoErrors(response);
      const report = response.data.createReport;
      expect(report.userId).toBe(parseInt(adminMockUser.id, 10));
      testReport = report;
    });

    test('Get report all reports: Success', async () => {
      const response = await testClient.query({
        query: GET_REPORTS,
        variables: {
          filterBy: {
            name: 'Test'
          },
          sortBy: 'ID',
          cursor: {
            page: 0,
            size: 5
          }
        }
      });
      expectNoErrors(response);
    });

    test('Get an report by report id: Success', async () => {
      const response = await testClient.query({
        query: GET_REPORT,
        variables: {
          reportId: testReport.id
        }
      });
      expectNoErrors(response);
      const { report } = response.data;
      expect(report.id).toBe(testReport.id);
    });

    test('Update report: Success', async () => {
      const response = await testClient.mutate({
        mutation: UPDATE_REPORT,
        variables: {
          reportId: testReport.id,
          input: {
            name: 'Updated Test Report',
            userId: parseInt(adminMockUser.id, 10),
            matrix: {
              area: customReport[0].area, // Quote
              filters: [
                customReport[0].fields[2],
                customReport[0].fields[3],
                customReport[0].fields[4],
                customReport[0].fields[5],
                customReport[0].fields[6],
                customReport[0].fields[7],
                customReport[0].fields[9]
              ]
            }
          }
        }
      });
      expectNoErrors(response);
      const report = response.data.updateReport;
      expect(report.id).toBe(testReport.id, 10);
    });

    test('Delete report: Success', async () => {
      const response = await testClient.mutate({
        mutation: DELETE_REPORT,
        variables: {
          reportId: testReport.id
        }
      });
      expectNoErrors(response);
      const result = response.data.deleteReport;
      expect(result).not.toBe(null);
    });
  });

  describe('Authenticatred as Admin and fetch data by report', () => {
    test('Fetch data from selected report', async () => {
      const server = createApolloServer({ user: adminMockUser });
      const testClient = createTestClient(server);
      const response = await testClient.query({
        query: FETCH_DATA,
        variables: {
          reportId: '27',
          filterBy: {},
          sortBy: {
            title: 'ID',
            type: 'DESC'
          },
          dateRange: {
            startDate: '2020-09-12',
            endDate: '2020-10-12'
          },
          cursor: {
            page: 0,
            size: 20
          }
        }
      });
      QATestConsole(response);
    });
  });
  describe('Authenticated but has necessary permissions missing', () => {
    test('(No permissions to view notes) View a note: Not allowed', async () => { });

    test('(No permissions to create a note) Create note A in quote A: Not allowed', async () => { });

    test('(No permissions to delete a note) Delete note A: Not allowed', async () => { });
  });
});
