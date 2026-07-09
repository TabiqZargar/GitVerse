export const PULL_REQUESTS_QUERY = `
  query($first: Int!) {
    viewer {
      pullRequests(first: $first, orderBy: { field: CREATED_AT, direction: DESC }) {
        totalCount
        nodes {
          id
          title
          url
          state
          createdAt
          mergedAt
          closedAt
          repository {
            nameWithOwner
          }
          additions
          deletions
          changedFiles
        }
      }
    }
  }
`;

export const ISSUES_QUERY = `
  query($first: Int!) {
    viewer {
      issues(first: $first, orderBy: { field: CREATED_AT, direction: DESC }) {
        totalCount
        nodes {
          id
          title
          url
          state
          createdAt
          closedAt
          repository {
            nameWithOwner
          }
          comments {
            totalCount
          }
        }
      }
    }
  }
`;

export const REVIEWS_QUERY = `
  query($first: Int!) {
    viewer {
      pullRequests(first: $first, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          repository {
            nameWithOwner
          }
          reviews(first: 10) {
            nodes {
              id
              state
              submittedAt
            }
          }
        }
      }
    }
  }
`;
