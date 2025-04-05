import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { apolloClient } from './apollo/client';

// Home/Default Component
const DefaultAuthView = () => (
  <Container className="py-5">
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-primary text-white text-center py-4" 
               style={{background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"}}>
            <h2 className="fw-bold mb-0">Welcome to Community Portal</h2>
            <p className="mb-0 opacity-75">Your neighborhood, connected</p>
          </div>
          <Card.Body className="p-4 text-center">
            <div className="mb-4">
              <div className="rounded-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center" 
                   style={{width: "100px", height: "100px"}}>
                <i className="bi bi-buildings text-primary" style={{fontSize: "3rem"}}></i>
              </div>
              <h4 className="fw-bold mb-3">Authentication</h4>
              <p className="text-muted mb-4">Please log in or create an account to participate in your community.</p>
            </div>
            
            <Row className="g-3 justify-content-center">
              <Col sm={6}>
                <Link to="login" className="text-decoration-none">
                  <Button variant="primary" className="w-100 py-2" 
                          style={{
                            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                            border: "none",
                            boxShadow: "0 4px 10px rgba(42, 117, 252, 0.3)"
                          }}>
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </Button>
                </Link>
              </Col>
              <Col sm={6}>
                <Link to="register" className="text-decoration-none">
                  <Button variant="outline-primary" className="w-100 py-2">
                    <i className="bi bi-person-plus me-2"></i>Create Account
                  </Button>
                </Link>
              </Col>
            </Row>
            
            <div className="mt-4 pt-3 border-top">
              <p className="text-muted small mb-0">
                By signing in or creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Container className="py-4">
          <Routes>
            <Route index element={<DefaultAuthView />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
