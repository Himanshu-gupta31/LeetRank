export interface ProfileData {
    userProfile: {
      matchedUser: {
        username: string;
        githubUrl: string | null;
        twitterUrl: string | null;
        linkedinUrl: string | null;
        contributions: {
          points: number;
          questionCount: number;
          testcaseCount: number;
        };
        profile: {
          realName: string | null;
          userAvatar: string | null;
          birthday: string | null;
          ranking: number;
          reputation: number;
          websites: string[];
          countryName: string | null;
          company: string | null;
          school: string | null;
          skillTags: string[];
          aboutMe: string | null;
          starRating: number;
        };
        submitStats: {
          acSubmissionNum: {
            difficulty: string;
            count: number;
            submissions: number;
          }[];
        };
      };
    };
    languageStats: {
      matchedUser: {
        languageProblemCount: {
          languageName: string;
          problemsSolved: number;
        }[];
      };
    };
    collegeData: {
      id: string;
      name: string;
      area: string;
      state: string;
      country: string;
    };
    username: string;
  }
  