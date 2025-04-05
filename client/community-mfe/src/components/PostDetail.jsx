import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_POST = gql`
  query GetPost($id: ID!) {
    communityPost(id: $id) {
      id
      title
      content
      category
      linkedDiscussionId
      participants {
        id
        username
      }
      author {
        id
        username
      }
      createdAt
    }
  }
`;

const GET_LINKED_POST = gql`
  query GetLinkedPost($id: ID!) {
    communityPost(id: $id) {
      id
      title
      author {
        username
      }
    }
  }
`;

const JOIN_DISCUSSION = gql`
  mutation JoinDiscussion($postId: ID!) {
    joinDiscussion(postId: $postId) {
      id
      participants {
        id
        username
      }
    }
  }
`;

const LEAVE_DISCUSSION = gql`
  mutation LeaveDiscussion($postId: ID!) {
    leaveDiscussion(postId: $postId) {
      id
      participants {
        id
        username
      }
    }
  }
`;

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [joinError, setJoinError] = useState(null);
  
  const { loading, error, data, refetch } = useQuery(GET_POST, {
    variables: { id: postId }
  });
  
  const { data: linkedPostData } = useQuery(GET_LINKED_POST, {
    variables: { id: data?.communityPost?.linkedDiscussionId || '' },
    skip: !data?.communityPost?.linkedDiscussionId
  });

  const [joinDiscussion, { loading: joiningDiscussion }] = useMutation(JOIN_DISCUSSION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setJoinError(error.message);
    }
  });
  
  const [leaveDiscussion, { loading: leavingDiscussion }] = useMutation(LEAVE_DISCUSSION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setJoinError(error.message);
    }
  });

  if (loading) return (
    <Container className="py-4 text-center">
      <Spinner animation="border" />
      <p className="mt-2">Loading post...</p>
    </Container>
  );
  
  if (error) return (
    <Container className="py-4">
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>Error loading post: {error.message}</p>
        <Button onClick={() => navigate(-1)} variant="outline-secondary">Go Back</Button>
      </Alert>
    </Container>
  );

  const post = data.communityPost;
  const isNews = post.category === 'news';
  const isDiscussion = post.category === 'discussion';
  
  // Get current user ID
  const currentUserId = localStorage.getItem('userId') || (JSON.parse(localStorage.getItem('user') || '{}').id);
  const isAuthor = currentUserId === post.author.id;
  
  // Check if user has already joined the discussion
  const hasJoined = post.participants?.some(participant => participant.id === currentUserId);
  
  const handleJoinDiscussion = async () => {
    try {
      await joinDiscussion({
        variables: { postId }
      });
    } catch (err) {
      console.error('Error joining discussion:', err);
    }
  };
  
  const handleLeaveDiscussion = async () => {
    try {
      await leaveDiscussion({
        variables: { postId }
      });
    } catch (err) {
      console.error('Error leaving discussion:', err);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Back
        </Button>
        
        {isAuthor && (
          <Button variant="outline-primary" onClick={() => navigate(`../edit-post/${post.id}`)}>
            <i className="bi bi-pencil me-2"></i> Edit Post
          </Button>
        )}
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fs-2 mb-0">{post.title}</h2>
            <Badge bg={isNews ? "info" : "primary"} className="px-3 py-2">
              {isNews ? "News" : "Discussion"}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Subtitle className="mb-3 text-muted">
            {isNews ? "Posted" : "Started"} by {post.author.username}
          </Card.Subtitle>
          
          <div className="my-4 fs-5">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {isNews && post.linkedDiscussionId && linkedPostData && (
            <div className="mt-4 p-3 bg-light rounded">
              <h5>Join the discussion</h5>
              <p>This news post is linked to a discussion: <strong>{linkedPostData.communityPost.title}</strong></p>
              <Link to={`../discussions/post/${post.linkedDiscussionId}`}>
                <Button variant="success">
                  <i className="bi bi-chat-text me-1"></i> View Discussion
                </Button>
              </Link>
            </div>
          )}
          
          {isDiscussion && (
            <div className="mt-4">
              {joinError && (
                <Alert variant="danger" onClose={() => setJoinError(null)} dismissible>
                  {joinError}
                </Alert>
              )}
              
              {hasJoined ? (
                <div className="d-flex align-items-center">
                  <Badge bg="success" className="me-3 px-3 py-2">
                    <i className="bi bi-check-circle me-1"></i> You've joined this discussion
                  </Badge>
                  <Button 
                    variant="outline-danger" 
                    onClick={handleLeaveDiscussion}
                    disabled={leavingDiscussion}
                  >
                    {leavingDiscussion ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" /> Leaving...
                      </>
                    ) : (
                      <>Leave Discussion</>
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleJoinDiscussion}
                  disabled={joiningDiscussion}
                >
                  {joiningDiscussion ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" /> Joining...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-chat me-2"></i> Join Discussion
                    </>
                  )}
                </Button>
              )}
              
              {post.participants && post.participants.length > 0 && (
                <div className="mt-3">
                  <strong>{post.participants.length} participant{post.participants.length !== 1 ? 's' : ''}</strong>: 
                  {post.participants.map((participant, idx) => (
                    <span key={participant.id} className="ms-2">
                      {participant.username}{idx < post.participants.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-3 text-muted font-italic">
                <i className="bi bi-info-circle me-2"></i> Comments feature coming soon
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {isNews && !post.linkedDiscussionId && (
        <div className="text-center mt-4">
          <p>Want to discuss this news post?</p>
          <Link to="../create-discussion" state={{ relatedNewsId: post.id, defaultCategory: 'discussion' }}>
            <Button variant="outline-primary">
              <i className="bi bi-chat-dots me-2"></i> Start a New Discussion
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
}

export default PostDetail; 