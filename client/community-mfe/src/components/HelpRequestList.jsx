import React, { useState } from 'react';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

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

const DELETE_HELP_REQUEST = gql`
  mutation DeleteHelpRequest($id: ID!) {
    deleteHelpRequest(id: $id)
  }
`;

function HelpRequestList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_HELP_REQUESTS);
  const [deleteHelpRequest] = useMutation(DELETE_HELP_REQUEST, {
    refetchQueries: [{ query: GET_HELP_REQUESTS }],
    awaitRefetchQueries: true
  });

  const currentUserId = localStorage.getItem('userId') || (JSON.parse(localStorage.getItem('user') || '{}').id);

  const handleDelete = async (id) => {
    try {
      await deleteHelpRequest({
        variables: { id }
      });
    } catch (error) {
      console.error('Error deleting help request:', error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`../help-requests/request/${id}`);
  };

  if (loading) return <div className="p-4 text-center"><Spinner animation="border" /></div>;
  if (error) return <div className="p-4 alert alert-danger">Error: {error.message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Help Requests</h2>
        <Link to="../create-help-request">
          <Button variant="primary">Create Help Request</Button>
        </Link>
      </div>

      {data.helpRequests.length === 0 ? (
        <div className="text-center p-5">
          <p className="mb-3">No help requests yet. Be the first to create one!</p>
          <Link to="../create-help-request">
            <Button variant="outline-primary">Create Help Request</Button>
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {data.helpRequests.map((request) => (
            <Col key={request.id} md={6} lg={4}>
              <Card 
                className="h-100 shadow-sm hover-card"
                onClick={() => handleCardClick(request.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title>
                        {request.description.length > 100 
                          ? `${request.description.substring(0, 100)}...` 
                          : request.description
                        }
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Posted by {request.author.username}
                      </Card.Subtitle>
                    </div>
                    {currentUserId === request.author.id && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(request.id);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </Container>
  );
}

export default HelpRequestList; 