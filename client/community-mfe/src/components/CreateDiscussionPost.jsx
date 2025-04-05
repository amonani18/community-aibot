import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!, $linkedDiscussionId: ID) {
    createCommunityPost(title: $title, content: $content, category: $category, linkedDiscussionId: $linkedDiscussionId) {
      id
      title
      content
      category
      linkedDiscussionId
    }
  }
`;

// Define the mutation to update a news post
const UPDATE_NEWS_POST = gql`
  mutation UpdateNewsPost($id: ID!, $linkedDiscussionId: ID!) {
    updateCommunityPost(id: $id, linkedDiscussionId: $linkedDiscussionId) {
      id
      linkedDiscussionId
    }
  }
`;

const GET_NEWS_POST = gql`
  query GetNewsPost($id: ID!) {
    communityPost(id: $id) {
      id
      title
      author {
        username
      }
    }
  }
`;

function CreateDiscussionPost() {
  const location = useLocation();
  const relatedNewsId = location.state?.relatedNewsId;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'discussion'
  });
  const [relatedNewsPost, setRelatedNewsPost] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [createPost] = useMutation(CREATE_POST);
  const [updateNewsPost] = useMutation(UPDATE_NEWS_POST);
  
  // Query related news post if ID is provided
  const { data: relatedPostData } = useQuery(GET_NEWS_POST, {
    variables: { id: relatedNewsId || '' },
    skip: !relatedNewsId
  });
  
  // Set related post data when query completes
  useEffect(() => {
    if (relatedPostData?.communityPost) {
      setRelatedNewsPost(relatedPostData.communityPost);
    }
  }, [relatedPostData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create the discussion post
      const result = await createPost({
        variables: {
          title: formData.title,
          content: formData.content,
          category: 'discussion'
        }
      });
      
      // If this was a discussion related to a news post, update the news post to link to this discussion
      if (relatedNewsId) {
        try {
          // Update the news post to link to this discussion
          await updateNewsPost({
            variables: {
              id: relatedNewsId,
              linkedDiscussionId: result.data.createCommunityPost.id
            }
          });
          console.log('News post updated with link to discussion');
        } catch (updateError) {
          console.error('Error linking discussion to news post:', updateError);
          // Continue anyway since the discussion was created
        }
      }
      
      navigate('../discussions');
    } catch (error) {
      setError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="mx-auto" style={{ maxWidth: '800px' }}>
        <Card.Header className="bg-primary text-white">
          <h2 className="m-0">Start New Discussion</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {relatedNewsPost && (
            <Alert variant="info" className="mb-4">
              <Alert.Heading>Creating a Discussion for a News Post</Alert.Heading>
              <p>
                You're starting a new discussion related to the news post: 
                <strong> {relatedNewsPost.title}</strong> by {relatedNewsPost.author.username}
              </p>
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Discussion title..."
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Share your thoughts..."
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Start Discussion'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateDiscussionPost; 