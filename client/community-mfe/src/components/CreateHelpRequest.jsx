import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    helpRequests {
      id
      description
      author {
        id
        username
      }
      createdAt
    }
  }
`;

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($description: String!) {
    createHelpRequest(description: $description) {
      id
      description
      author {
        id
        username
      }
      createdAt
    }
  }
`;

function CreateHelpRequest() {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [createHelpRequest] = useMutation(CREATE_HELP_REQUEST, {
    refetchQueries: [{ query: GET_HELP_REQUESTS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      navigate('../help-requests');
    },
    onError: (error) => {
      setError(error.message);
      setSubmitting(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createHelpRequest({
        variables: { description }
      });
    } catch (error) {
      console.error('Error creating help request:', error);
    }
  };

  return (
    <Container className="py-4">
      <Card className="mx-auto" style={{ maxWidth: '800px' }}>
        <Card.Header className="bg-primary text-white">
          <h2 className="m-0">Create Help Request</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe what you need help with..."
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Create Help Request'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateHelpRequest; 