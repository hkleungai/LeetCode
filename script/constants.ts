export enum DIFFICULTY {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum STATUS {
  ATTEMPTED = 'TRIED',
  COMPLETED = 'AC',
  TODO = 'NOT_STARTED',
}

export enum QUERY {
  COUNT = `#graphql
  {
    questionList(
      limit: 1
      skip: 0
      categorySlug: ""
      filters: {}
    ) {
      total: totalNum
    }
  }
  `,
  DETAIL = `#graphql
    query problemsetQuestionList(
      $limit: Int,
      $filters: QuestionListFilterInput,
    ) {
      questionList(
        limit: $limit
        filters: $filters
        categorySlug: ""
        skip: 0
      ) {
        data {
          difficulty
          id: questionFrontendId
          is_premium: isPaidOnly
          title_display: title
          title_value: titleSlug
          topics: topicTags {
            display: name
            value: slug
          }
          similar_questions: similarQuestions
          content
        }
      }
    }
  `,
  ID = `#graphql
    query problemsetQuestionList(
      $limit: Int,
      $filters: QuestionListFilterInput,
    ) {
      questionList(
        limit: $limit
        filters: $filters
        categorySlug: ""
        skip: 0
      ) {
        data {
          id: questionFrontendId
        }
      }
    }
  `,
  DESCRIPTION = `#graphql
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        boundTopicId
        title
        titleSlug
        content
        translatedTitle
        translatedContent
        isPaidOnly
        difficulty
        likes
        dislikes
        isLiked
        similarQuestions
        exampleTestcases
        categoryTitle
        contributors {
          username
          profileUrl
          avatarUrl
          __typename
        }
        topicTags {
          name
          slug
          translatedName
          __typename
        }
        companyTagStats
        codeSnippets {
          lang
          langSlug
          code
          __typename
        }
        stats
        hints
        solution {
          id
          canSeeDetail
          paidOnly
          hasVideoSolution
          paidOnlyVideo
          __typename
        }
        status
        sampleTestCase
        metaData
        judgerAvailable
        judgeType
        mysqlSchemas
        enableRunCode
        enableTestMode
        enableDebugger
        envInfo
        libraryUrl
        adminUrl
        challengeQuestion {
          id
          date
          incompleteChallengeCount
          streakCount
          type
          __typename
        }
        __typename
      }
    }
  `
}

// FIXME: Switch to URL enum after the issue in https://github.com/microsoft/TypeScript/issues/40793 is addressed.
/**
```
export enum URL {
  BASE = 'https://leetcode.com',
  ALL = `${BASE_URL}/problemset/all/`,
  GRAPHQL =  `${BASE_URL}/graphql/`  ,
}
```
*/
export const BASE_URL = 'https://leetcode.com';
export const ALL_PROBLEM_URL = `${BASE_URL}/problemset/all`;
export const GRAPHQL_URL =  `${BASE_URL}/graphql`;
export const PROBLEMS_URL =  `${BASE_URL}/problems`;
export const TAG_URL =  `${BASE_URL}/tag`;
