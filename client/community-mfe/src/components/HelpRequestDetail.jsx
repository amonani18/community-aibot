import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';

const GET_HELP_REQUEST = gql`
  query GetHelpRequest($id: ID!) {
    helpRequest(id: $id) {
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

function HelpRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_HELP_REQUEST, {
    variables: { id: requestId }
  });

  if (loading) return <div className="p-4 text-center"><Spinner animation="border" /></div>;
  if (error) return <div className="p-4 alert alert-danger">Error: {error.message}</div>;

  const request = data.helpRequest;
  const currentUserId = localStorage.getItem('userId') || (JSON.parse(localStorage.getItem('user') || '{}').id);
  const isAuthor = request.author.id === currentUserId;

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Help Request Details</h4>
            {isAuthor && (
              <div>
                <Button 
                  variant="outline-danger" 
                  className="ms-2"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this help request?')) {
                      // Handle delete
                      navigate('../help-requests');
                    }
                  }}
                >
                  Delete Request
                </Button>
              </div>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <h5>{request.description}</h5>
          <p className="text-muted">
            Posted by {request.author.username}
          </p>
        </Card.Body>
        <Card.Footer className="bg-light">
          <Button variant="secondary" onClick={() => navigate('../help-requests')}>
            Back to Help Requests
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default HelpRequestDetail; 