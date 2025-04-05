import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Login attempt with:', { email });
    
    try {
      const { data } = await loginMutation({
        variables: { email, password }
      });
      
      console.log('Login successful, received data:', data);
      
      if (data && data.login && data.login.token) {
        login(data.login.token, data.login.user);
        console.log('Login handler called, token saved');
      } else {
        setError('Invalid response from server');
        console.error('Invalid login response:', data);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        setError(`GraphQL Error: ${error.graphQLErrors[0].message}`);
      } else if (error.networkError) {
        setError(`Network Error: ${error.networkError.message}`);
      } else {
        setError(error.message || 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // For demonstration purposes - in a real app, you'd remove this
  const handleTestLogin = () => {
    // Manually set token for testing
    const testUser = {
      id: 'test123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'resident'
    };
    
    localStorage.setItem('token', 'test-token-123');
    login('test-token-123', testUser);
    console.log('Test login activated');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-primary text-white text-center py-4" 
                 style={{background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"}}>
              <h2 className="fw-bold mb-0">Welcome Back</h2>
              <p className="mb-0 opacity-75">Sign in to your account</p>
            </div>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4 border-0 shadow-sm">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </div>
                </Alert>
              )}
              <Form onSubmit={handleSubmit} className="login-form">
                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="py-2 border border-2"
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-2 border border-2"
                    placeholder="Enter your password"
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fw-bold"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    border: "none",
                    boxShadow: "0 4px 10px rgba(42, 117, 252, 0.3)"
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="ms-2">Signing In...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>
              <div className="text-center mt-4">
                <Link to="../register" className="text-decoration-none fw-bold">
                  <i className="bi bi-person-plus me-1"></i> New user? Create an account
                </Link>
              </div>
              <div className="mt-4 pt-3 border-top">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleTestLogin}
                  className="w-100"
                >
                  <i className="bi bi-lightning me-1"></i> Test Login (Demo Only)
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login; 