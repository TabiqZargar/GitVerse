export const USER_PROFILE_QUERY = `
  query($first: Int!) {
    viewer {
      login
      name
      avatarUrl
      email
      bio
      company
      location
      websiteUrl
      twitterUsername
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: $first, ownerAffiliations: [OWNER, COLLABORATOR], isFork: false) {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export const USER_QUERY = `
  query($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      email
      bio
      company
      location
      websiteUrl
      twitterUsername
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR], isFork: false) {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;
