/*
GraphQL Mutations Test File

This file contains all available GraphQL mutations for testing the API.
Copy and paste these mutations into your GraphQL playground or client application.

Base URL: http://localhost:4000/graphql

1. Authentication Mutations
--------------------------

Register a new user:
mutation RegisterUser {
  register(
    username: "testuser"
    email: "test@example.com"
    password: "Password123"
    role: "resident"
  ) {
    token
    user {
      id
      username
      email
      role
    }
  }
}

Login:
mutation LoginUser {
  login(
    email: "test@example.com"
    password: "Password123"
  ) {
    token
    user {
      id
      username
      email
      role
    }
  }
}

Logout:
mutation LogoutUser {
  logout
}

2. Community Post Mutations
--------------------------

Create a news post:
mutation CreateNewsPost {
  createCommunityPost(
    title: "New Community Event"
    content: "Join us for the annual community picnic!"
    category: "news"
  ) {
    id
    title
    content
    category
    author {
      id
      username
    }
  }
}

Create a discussion post:
mutation CreateDiscussionPost {
  createCommunityPost(
    title: "What do you think about the new park?"
    content: "I'd love to hear your thoughts on the new park design."
    category: "discussion"
  ) {
    id
    title
    content
    category
    author {
      id
      username
    }
  }
}

Update a post:
mutation UpdatePost {
  updateCommunityPost(
    id: "POST_ID"
    title: "Updated Title"
    content: "Updated content"
  ) {
    id
    title
    content
    updatedAt
  }
}

Delete a post:
mutation DeletePost {
  deleteCommunityPost(id: "POST_ID")
}

Join a discussion:
mutation JoinDiscussion {
  joinDiscussion(postId: "POST_ID") {
    id
    participants {
      id
      username
    }
  }
}

Leave a discussion:
mutation LeaveDiscussion {
  leaveDiscussion(postId: "POST_ID") {
    id
    participants {
      id
      username
    }
  }
}

3. Help Request Mutations
------------------------

Create a help request:
mutation CreateHelpRequest {
  createHelpRequest(
    description: "Need help moving furniture"
    location: "123 Main St"
  ) {
    id
    description
    location
    author {
      id
      username
    }
  }
}

Update a help request:
mutation UpdateHelpRequest {
  updateHelpRequest(
    id: "REQUEST_ID"
    description: "Updated description"
    location: "456 Oak St"
  ) {
    id
    description
    location
    updatedAt
  }
}

Delete a help request:
mutation DeleteHelpRequest {
  deleteHelpRequest(id: "REQUEST_ID")
}

4. AI Assistant Queries
----------------------

Query the AI assistant:
query AIQuery {
  communityAIQuery(input: "What are the upcoming community events?") {
    text
    suggestedQuestions
    retrievedPosts {
      id
      title
      content
    }
  }
}

Get AI interaction history:
query AIInteractions {
  aiInteractions(userId: "USER_ID") {
    id
    query
    response
    createdAt
  }
}

Notes:
1. Replace POST_ID, REQUEST_ID, and USER_ID with actual IDs from your database
2. All mutations except register and login require authentication
3. Add the Authorization header with the token: "Bearer YOUR_TOKEN"
4. The role field in register mutation accepts: "resident", "business_owner", or "community_organizer"
5. The category field in createCommunityPost accepts: "news" or "discussion"
*/ 