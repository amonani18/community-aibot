# GraphQL Mutations Reference

This document contains all available GraphQL mutations for the client applications.

## Base Configuration
- GraphQL Endpoint: `http://localhost:4000/graphql`
- Authentication Header: `Authorization: Bearer YOUR_TOKEN`

## 1. Authentication Mutations

### Register User
```graphql
mutation RegisterUser($username: String!, $email: String!, $password: String!, $role: String!) {
  register(username: $username, email: $email, password: $password, role: $role) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

### Login
```graphql
mutation LoginUser($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

### Logout
```graphql
mutation LogoutUser {
  logout
}
```

## 2. Community Post Mutations

### Create News Post
```graphql
mutation CreateNewsPost($title: String!, $content: String!) {
  createCommunityPost(
    title: $title
    content: $content
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
```

### Create Discussion Post
```graphql
mutation CreateDiscussionPost($title: String!, $content: String!, $linkedDiscussionId: ID) {
  createCommunityPost(
    title: $title
    content: $content
    category: "discussion"
    linkedDiscussionId: $linkedDiscussionId
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
```

### Update Post
```graphql
mutation UpdatePost($id: ID!, $title: String, $content: String, $category: String) {
  updateCommunityPost(
    id: $id
    title: $title
    content: $content
    category: $category
  ) {
    id
    title
    content
    category
    updatedAt
  }
}
```

### Delete Post
```graphql
mutation DeletePost($id: ID!) {
  deleteCommunityPost(id: $id)
}
```

### Join Discussion
```graphql
mutation JoinDiscussion($postId: ID!) {
  joinDiscussion(postId: $postId) {
    id
    participants {
      id
      username
    }
  }
}
```

### Leave Discussion
```graphql
mutation LeaveDiscussion($postId: ID!) {
  leaveDiscussion(postId: $postId) {
    id
    participants {
      id
      username
    }
  }
}
```

## 3. Help Request Mutations

### Create Help Request
```graphql
mutation CreateHelpRequest($description: String!, $location: String) {
  createHelpRequest(
    description: $description
    location: $location
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
```

### Update Help Request
```graphql
mutation UpdateHelpRequest($id: ID!, $description: String, $location: String) {
  updateHelpRequest(
    id: $id
    description: $description
    location: $location
  ) {
    id
    description
    location
    updatedAt
  }
}
```

### Delete Help Request
```graphql
mutation DeleteHelpRequest($id: ID!) {
  deleteHelpRequest(id: $id)
}
```

## 4. AI Assistant Queries

### Query AI Assistant
```graphql
query AIQuery($input: String!) {
  communityAIQuery(input: $input) {
    text
    suggestedQuestions
    retrievedPosts {
      id
      title
      content
    }
  }
}
```

### Get AI Interactions
```graphql
query AIInteractions($userId: ID!) {
  aiInteractions(userId: $userId) {
    id
    query
    response
    createdAt
  }
}
```

## Important Notes

1. **Authentication**
   - All mutations except `register` and `login` require authentication
   - Include the JWT token in the Authorization header
   - Format: `Authorization: Bearer YOUR_TOKEN`

2. **User Roles**
   - Valid roles: `resident`, `business_owner`, `community_organizer`
   - Set during registration

3. **Post Categories**
   - Valid categories: `news`, `discussion`
   - Required when creating posts

4. **Error Handling**
   - Check for authentication errors
   - Handle validation errors for required fields
   - Implement proper error messages in the UI

5. **Best Practices**
   - Always use variables instead of hardcoded values
   - Implement proper loading states
   - Cache responses when appropriate
   - Handle token expiration 