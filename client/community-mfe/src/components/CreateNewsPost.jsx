import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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

function CreateNewsPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    linkedDiscussionId: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [createPost] = useMutation(CREATE_POST);

  const { data: discussionsData } = useQuery(GET_DISCUSSIONS);

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
      // Create a clean variables object without empty linkedDiscussionId
      const variables = {
        title: formData.title,
        content: formData.content,
        category: 'news'
      };
      
      // Only add linkedDiscussionId if it has a value
      if (formData.linkedDiscussionId) {
        variables.linkedDiscussionId = formData.linkedDiscussionId;
      }
      
      await createPost({ variables });
      
      navigate('../news');
    } catch (error) {
      setError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="mx-auto" style={{ maxWidth: '800px' }}>
        <Card.Header className="bg-primary text-white">
          <h2 className="m-0">Create News Post</h2>
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
                placeholder="News title..."
              />
            </Form.Group>
            
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
            
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Share your news..."
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create News Post'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateNewsPost; 