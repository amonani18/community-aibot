const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type CommunityPost {
    id: ID!
    author: User!
    title: String!
    content: String!
    category: String!
    linkedDiscussionId: ID
    aiSummary: String
    participants: [User!]
    createdAt: String!
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: User!
    description: String!
    location: String
    createdAt: String!
    updatedAt: String
  }

  type AIResponse {
    text: String!
    suggestedQuestions: [String!]!
    retrievedPosts: [CommunityPost!]!
  }

  type AIInteraction {
    id: ID!
    userId: ID!
    query: String!
    response: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    communityPosts(category: String, userId: ID): [CommunityPost!]!
    communityPost(id: ID!): CommunityPost
    helpRequests(userId: ID): [HelpRequest!]!
    helpRequest(id: ID!): HelpRequest
    communityAIQuery(input: String!): AIResponse!
    aiInteractions(userId: ID!): [AIInteraction!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!

    createCommunityPost(title: String!, content: String!, category: String!, linkedDiscussionId: ID): CommunityPost!
    updateCommunityPost(id: ID!, title: String, content: String, category: String, linkedDiscussionId: ID): CommunityPost!
    deleteCommunityPost(id: ID!): Boolean!
    joinDiscussion(postId: ID!): CommunityPost!
    leaveDiscussion(postId: ID!): CommunityPost!

    createHelpRequest(description: String!, location: String): HelpRequest!
    updateHelpRequest(id: ID!, description: String, location: String): HelpRequest!
    deleteHelpRequest(id: ID!): Boolean!
  }
`;

module.exports = typeDefs; 