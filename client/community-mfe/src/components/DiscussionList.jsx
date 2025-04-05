import React, { useState } from 'react';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_DISCUSSIONS = gql`
  query GetDiscussions {
    communityPosts(category: "discussion") {
      id
      title
      content
      author {
        id
        username
      }
      createdAt
      aiSummary
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deleteCommunityPost(id: $id)
  }
`;

function DiscussionList() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_DISCUSSIONS);
  const [deletePost] = useMutation(DELETE_POST);
  const [expandedId, setExpandedId] = useState(null);

  const currentUserId = localStorage.getItem('userId') || (JSON.parse(localStorage.getItem('user') || '{}').id);

  const handleEdit = (postId) => {
    navigate(`../edit-post/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost({
        variables: { id: postId }
      });
      refetch();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleCardClick = (id) => {
    navigate(`post/${id}`);
  };

  if (loading) return <div className="p-4 text-center"><Spinner animation="border" /></div>;
  if (error) return <div className="p-4 alert alert-danger">Error: {error.message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-1">Community Discussions</h2>
        <div className="d-flex gap-3">
          <Link to="../news" className="text-decoration-none">
            <Button variant="outline-secondary" size="lg">View News</Button>
          </Link>
          <Link to="../create-discussion">
            <Button variant="primary" size="lg">Start Discussion</Button>
          </Link>
        </div>
      </div>

      {data.communityPosts.length === 0 ? (
        <div className="text-center p-5">
          <p className="mb-3 fs-4">No discussions yet. Be the first to start a conversation!</p>
          <Link to="create-post">
            <Button variant="outline-primary" size="lg">Start Discussion</Button>
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {data.communityPosts.map((post) => (
            <Col key={post.id} md={6} lg={4} className="mb-4">
              <Card 
                className="h-100 shadow-sm discussion-card"
                onClick={() => handleCardClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title className="fs-4">{post.title}</Card.Title>
                    {currentUserId && post.author.id === currentUserId && (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(post.id);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    )}
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">
                    Started by {post.author.username}
                  </Card.Subtitle>
                  <Card.Text>
                    {post.aiSummary || (post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content)
                    }
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <style>{`
        .discussion-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .discussion-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </Container>
  );
}

export default DiscussionList; 