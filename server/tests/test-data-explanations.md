# Test Data Explanations

This document explains how to use the test data provided in `test-data.json`.

## Placeholder Values

The following placeholders are used in the test data and need to be replaced with actual values:

- `NEWS_POST_ID_1`, `NEWS_POST_ID_2`: Replace with actual news post IDs after creating them
- `JWT_TOKEN_HERE`: Replace with the token received from login/register
- `USER_ID_HERE`: Replace with the actual user ID
- `POST_ID_HERE`: Replace with the actual post ID
- `REQUEST_ID_HERE`: Replace with the actual help request ID

## Test Data Structure

### 1. Users
Three test users with different roles:
- Resident (aniket)
- Business Owner (hema)
- Community Organizer (aaru)

### 2. News Posts
Two example news posts:
1. Community Garden Opening
2. Road Closure Announcement

### 3. Discussion Posts
Two example discussion posts linked to news posts:
1. Garden Discussion (linked to garden news)
2. Road Closure Discussion (linked to road closure news)

### 4. Help Requests
Three example help requests:
1. Moving furniture
2. Dog walking
3. Computer troubleshooting

### 5. AI Queries
Three example AI queries:
1. Upcoming events
2. Community garden
3. Construction work

### 6. Example Responses
Sample responses for each mutation type, showing the expected structure.

## How to Use

1. **Authentication**
   - First, register a user using the data from `users` array
   - Use the received token for subsequent authenticated requests

2. **Creating Posts**
   - Create news posts first
   - Note the IDs of created news posts
   - Replace `NEWS_POST_ID_1` and `NEWS_POST_ID_2` in discussion posts
   - Create discussion posts

3. **Help Requests**
   - Create help requests using the data from `helpRequests` array
   - Note the IDs of created requests for updates/deletes

4. **AI Queries**
   - Use the queries from `aiQueries` array
   - Compare responses with the structure in `exampleResponses.aiQuery`

## Testing Sequence

1. Register/Login
2. Create News Posts
3. Create Discussion Posts (linked to news)
4. Create Help Requests
5. Test AI Queries
6. Update/Delete operations

## Notes

- All mutations except register/login require authentication
- Replace all placeholder values with actual IDs
- The example responses show the expected structure but not actual values
- Use the GraphQL playground to test mutations before implementing in the client 