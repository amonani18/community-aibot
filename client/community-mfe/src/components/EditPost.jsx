import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_POST = gql`
  query GetPost($id: ID!) {
    communityPost(id: $id) {
      id
      title
      content
      category
      linkedDiscussionId
      author {
        id
        username
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $content: String!, $category: String!, $linkedDiscussionId: ID) {
    updateCommunityPost(id: $id, title: $title, content: $content, category: $category, linkedDiscussionId: $linkedDiscussionId) {
      id
      title
      content
      category
      linkedDiscussionId
    }
  }
`;

const GET_DISCUSSIONS = gql`
  query GetDiscussions {
    communityPosts(category: "discussion") {
      id
      title
      author {
        username
      }
      createdAt
    }
  }
`;

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'news',
    linkedDiscussionId: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const { loading, error: queryError, data } = useQuery(GET_POST, {
    variables: { id: postId },
    onCompleted: (data) => {
      // Check if the current user is the author of this post
      const currentUserId = localStorage.getItem('userId') || (JSON.parse(localStorage.getItem('user') || '{}').id);
      if (data.communityPost.author.id !== currentUserId) {
        setUnauthorized(true);
        return;
      }
      
      setFormData({
        title: data.communityPost.title,
        content: data.communityPost.content,
        category: data.communityPost.category,
        linkedDiscussionId: data.communityPost.linkedDiscussionId || ''
      });
    }
  });
  
  const { data: discussionsData } = useQuery(GET_DISCUSSIONS, {
    skip: formData.category !== 'news' // Only fetch discussions when category is news
  });
  
  const [updatePost] = useMutation(UPDATE_POST);

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
      const variables = { 
        id: postId,
        title: formData.title,
        content: formData.content,
        category: formData.category
      };
      
      // Only include linkedDiscussionId if category is news and a discussion is selected
      if (formData.category === 'news' && formData.linkedDiscussionId) {
        variables.linkedDiscussionId = formData.linkedDiscussionId;
      }
      
      await updatePost({ variables });
      navigate(formData.category === 'news' ? '/community/news' : '/community/discussions');
    } catch (error) {
      setError(error.message);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Container className="py-4 text-center">
      <Spinner animation="border" />
      <p className="mt-2">Loading post...</p>
    </Container>
  );
  
  if (queryError) return (
    <Container className="py-4">
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>Error loading post: {queryError.message}</p>
        <Button onClick={() => navigate(-1)} variant="outline-secondary">Go Back</Button>
      </Alert>
    </Container>
  );

  if (unauthorized) return (
    <Container className="py-4">
      <Alert variant="warning">
        <Alert.Heading>Unauthorized</Alert.Heading>
        <p>You don't have permission to edit this post.</p>
        <Button onClick={() => navigate(-1)} variant="outline-secondary">Go Back</Button>
      </Alert>
    </Container>
  );

  return (
    <Container className="py-4">
      <Card className="mx-auto" style={{ maxWidth: '800px' }}>
        <Card.Header className="bg-primary text-white">
          <h2 className="m-0">Edit Post</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="news">News</option>
                <option value="discussion">Discussion</option>
              </Form.Select>
            </Form.Group>
            
            {formData.category === 'news' && (
              <Form.Group className="mb-3">
                <Form.Label>Link to Existing Discussion (Optional)</Form.Label>
                <Form.Select
                  name="linkedDiscussionId"
                  value={formData.linkedDiscussionId}
                  onChange={handleChange}
                >
                  <option value="">No linked discussion</option>
                  {discussionsData?.communityPosts.map(discussion => (
                    <option key={discussion.id} value={discussion.id}>
                      {discussion.title} - {discussion.author.username}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Linking a discussion adds a "Join Discussion" button to your news post
                </Form.Text>
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Post'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditPost; 