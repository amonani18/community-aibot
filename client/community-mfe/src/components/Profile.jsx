import React from 'react';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';

const GET_USER_ACTIVITY = gql`
  query GetUserActivity($userId: ID!) {
    communityPosts(userId: $userId) {
      id
      title
      content
      category
      createdAt
    }
    helpRequests(userId: $userId) {
      id
      description
      createdAt
    }
  }
`;

function Profile() {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  const { data, loading } = useQuery(GET_USER_ACTIVITY, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only'
  });

  // Calculate post counts
  const newsPosts = data?.communityPosts?.filter(post => post.category === 'news') || [];
  const discussionPosts = data?.communityPosts?.filter(post => post.category === 'discussion') || [];
  const helpRequests = data?.helpRequests || [];

  if (loading) {
    return (
      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Body className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2>{user.username}'s Activity</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body className="text-center">
                  <h3 className="h4 mb-0">{newsPosts.length}</h3>
                  <p className="text-muted">News Posts</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body className="text-center">
                  <h3 className="h4 mb-0">{discussionPosts.length}</h3>
                  <p className="text-muted">Discussions</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body className="text-center">
                  <h3 className="h4 mb-0">{helpRequests.length}</h3>
                  <p className="text-muted">Help Requests</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h4 className="mt-4 mb-3">Recent Activity</h4>
          {data?.communityPosts?.map(post => (
            <Card key={post.id} className="mb-3">
              <Card.Body>
                <Badge bg={post.category === 'news' ? 'info' : 'primary'} className="mb-2">
                  {post.category}
                </Badge>
                <h5>{post.title}</h5>
                <small className="text-muted">
                  Posted on {new Date(parseInt(post.createdAt)).toLocaleDateString()}
                </small>
              </Card.Body>
            </Card>
          ))}

          {data?.helpRequests?.map(request => (
            <Card key={request.id} className="mb-3">
              <Card.Body>
                <Badge bg="success" className="mb-2">Help Request</Badge>
                <p className="mb-1">{request.description}</p>
                <small className="text-muted">
                  Requested on {new Date(parseInt(request.createdAt)).toLocaleDateString()}
                </small>
              </Card.Body>
            </Card>
          ))}

          {!data?.communityPosts?.length && !data?.helpRequests?.length && (
            <Card className="text-center">
              <Card.Body className="text-muted">
                No activity yet. Start participating in the community!
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile; 