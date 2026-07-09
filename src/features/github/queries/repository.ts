export const REPOSITORIES_QUERY = `
  query($first: Int!, $after: String) {
    viewer {
      repositories(
        first: $first
        after: $after
        ownerAffiliations: [OWNER, COLLABORATOR]
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          databaseId
          name
          nameWithOwner
          description
          url
          isPrivate
          isFork
          isArchived
          createdAt
          updatedAt
          pushedAt
          forkCount
          stargazerCount
          openIssues: issues(states: [OPEN]) {
            totalCount
          }
          diskUsage
          primaryLanguage {
            name
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
            }
          }
          defaultBranchRef {
            name
          }
          owner {
            login
          }
        }
      }
    }
  }
`;

export const SINGLE_REPO_QUERY = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      databaseId
      name
      nameWithOwner
      description
      url
      isPrivate
      isFork
      isArchived
      createdAt
      updatedAt
      pushedAt
      forkCount
      stargazerCount
      issues(states: [OPEN]) {
        totalCount
      }
      diskUsage
      primaryLanguage {
        name
      }
      languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          size
          node {
            name
          }
        }
      }
      defaultBranchRef {
        name
      }
      owner {
        login
      }
    }
  }
`;
