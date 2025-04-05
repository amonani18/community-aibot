import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { gql, useMutation } from '@apollo/client';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
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

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'resident'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await registerMutation({
        variables: formData
      });
      login(data.register.token, data.register.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-primary text-white text-center py-4" 
                 style={{background: "linear-gradient(135deg, #11cb8b 0%, #25a0fc 100%)"}}>
              <h2 className="fw-bold mb-0">Create Account</h2>
              <p className="mb-0 opacity-75">Join our community</p>
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
              <Form onSubmit={handleSubmit} className="register-form">
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-person me-2"></i>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="py-2 border border-2"
                    placeholder="Choose a username"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="py-2 border border-2"
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="py-2 border border-2"
                    placeholder="Create a password"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-people me-2"></i>
                    Role
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="py-2 border border-2"
                  >
                    <option value="resident">
                      Resident
                    </option>
                    <option value="business_owner">
                      Business Owner
                    </option>
                    <option value="community_organizer">
                      Community Organizer
                    </option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Your role determines your permissions in the community.
                  </Form.Text>
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fw-bold"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #11cb8b 0%, #25a0fc 100%)",
                    border: "none",
                    boxShadow: "0 4px 10px rgba(37, 160, 252, 0.3)"
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
                      <span className="ms-2">Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>
              <div className="text-center mt-4">
                <Link to="../login" className="text-decoration-none fw-bold">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Already have an account? Sign In
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;

 