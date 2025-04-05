import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Container, Nav, Navbar, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Loading Component
const LoadingSpinner = () => (
  <div className="text-center p-5">
    <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-primary fw-bold">Loading application...</p>
  </div>
);

// Home Component
const Home = () => (
  <div className="text-center py-5">
    <div className="mb-5 pb-3">
      <h1 className="display-4 fw-bold mb-3">Welcome to Community Portal</h1>
      <p className="lead">Connect with neighbors, share news, and help each other</p>
    </div>
    
    <Row className="g-4 justify-content-center">
      <Col md={4}>
        <div className="card h-100 border-0 shadow-sm hover-card">
          <div className="card-body text-center p-4">
            <div className="feature-icon-container mb-4">
              <div className="feature-icon bg-primary bg-opacity-10">
                <i className="bi bi-newspaper fs-1"></i>
              </div>
            </div>
            <h4>Community News</h4>
            <p className="text-muted mb-4">Stay informed about local events and important announcements</p>
            <Link to="/community" className="btn btn-outline-primary">
              <i className="bi bi-arrow-right-circle me-2"></i>
              Explore News
            </Link>
          </div>
        </div>
      </Col>
      
      <Col md={4}>
        <div className="card h-100 border-0 shadow-sm hover-card">
          <div className="card-body text-center p-4">
            <div className="feature-icon-container mb-4">
              <div className="feature-icon bg-success bg-opacity-10">
                <i className="bi bi-chat-dots fs-1"></i>
              </div>
            </div>
            <h4>Discussions</h4>
            <p className="text-muted mb-4">Share ideas and engage in meaningful conversations</p>
            <Link to="/community" className="btn btn-outline-success">
              <i className="bi bi-arrow-right-circle me-2"></i>
              Join Discussions
            </Link>
          </div>
        </div>
      </Col>
      
      <Col md={4}>
        <div className="card h-100 border-0 shadow-sm hover-card">
          <div className="card-body text-center p-4">
            <div className="feature-icon-container mb-4">
              <div className="feature-icon bg-warning bg-opacity-10">
                <i className="bi bi-people fs-1"></i>
              </div>
            </div>
            <h4>Help Requests</h4>
            <p className="text-muted mb-4">Request assistance or volunteer to help neighbors in need</p>
            <Link to="/community" className="btn btn-outline-warning">
              <i className="bi bi-arrow-right-circle me-2"></i>
              View Requests
            </Link>
          </div>
        </div>
      </Col>
    </Row>

    <style jsx>{`
      .hover-card {
        transition: transform 0.2s ease-in-out;
        cursor: pointer;
      }
      .hover-card:hover {
        transform: translateY(-5px);
      }
      .feature-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .feature-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      .hover-card:hover .feature-icon {
        transform: scale(1.1);
      }
      .feature-icon i {
        transition: all 0.3s ease;
      }
      .hover-card:hover .feature-icon i {
        transform: scale(1.1);
      }
    `}</style>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MFE Loading Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({ info: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-5">
          <Alert variant="danger" className="border-0 shadow-sm">
            <i className="bi bi-exclamation-triangle-fill fs-1 d-block mb-3"></i>
            <h3>Something went wrong</h3>
            <p className="mb-3">{this.state.error?.message}</p>
            {this.state.error?.stack && (
              <details className="mt-2 text-start">
                <summary className="text-secondary">Error details (for developers)</summary>
                <pre className="mt-2 bg-light p-2 rounded" style={{ fontSize: '0.8rem' }}>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
            <Button 
              variant="primary" 
              className="mt-3"
              onClick={() => {
                this.setState({ hasError: false, error: null, info: null });
                window.location.reload();
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load the micro frontends with fallback content
const AuthApp = lazy(() => {
  console.log("Loading AuthApp...");
  return import('auth/AuthApp')
    .catch(err => {
      console.error('Failed to load AuthApp:', err);
      throw new Error(`Failed to load Auth App: ${err.message}`);
    });
});

const CommunityApp = lazy(() => {
  console.log("Loading CommunityApp...");
  return import('community/App')
    .catch(err => {
      console.error('Failed to load CommunityApp:', err);
      throw new Error(`Failed to load Community App: ${err.message}`);
    });
});

const AIChatbot = lazy(() => import('ai_assistant/AIChatbot'));

// Authentication check function
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log("Container: Checking auth token:", token ? "Token exists" : "No token");
  return token !== null;
};

// Private Route component to protect routes
const PrivateRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    console.log("Container: Not authenticated, redirecting to login");
    // Prevent redirect loops by checking if we've already tried to redirect
    if (!sessionStorage.getItem('redirectAttempted')) {
      sessionStorage.setItem('redirectAttempted', 'true');
      window.location.href = '/auth/login';
      return <LoadingSpinner />;
    }
  }
  
  return authenticated ? children : (
    <Container className="py-5">
      <Alert variant="warning" className="border-0 shadow-sm text-center py-4">
        <i className="bi bi-shield-lock fs-1 mb-3 d-block"></i>
        <Alert.Heading>Authentication Required</Alert.Heading>
        <p>You need to be logged in to access this section.</p>
        <Link to="/auth/login" className="btn btn-primary mt-2">
          <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
        </Link>
      </Alert>
    </Container>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-dark text-white py-3">
    <Container>
      <div className="text-center">
        <p className="mb-0">© 2024 Community Portal. All rights reserved.</p>
      </div>
    </Container>
  </footer>
);

// Active Link component that shows the current route
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  
  return (
    <Nav.Link 
      as={Link} 
      to={to} 
      className={`nav-link px-3 ${isActive ? 'active fw-bold' : ''}`}
    >
      {children}
    </Nav.Link>
  );
};

// Navbar Component
const AppNavbar = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const isCommunityPage = location.pathname.startsWith('/community');
  const communityPath = location.pathname.split('/')[2] || 'news'; // Default to news if no specific path
  
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-1 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center py-0">
          <i className="bi bi-buildings me-2 text-primary" style={{ fontSize: "1.25rem" }}></i>
          <span className="fw-bold">Community Portal</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isLoggedIn && (
              <>
                <NavLink to="/auth/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </NavLink>
                <NavLink to="/auth/register">
                  <i className="bi bi-person-plus me-1"></i> Register
                </NavLink>
              </>
            )}
            {isLoggedIn && (
              <>
                {isCommunityPage ? (
                  <>
                    <NavLink to="/community/news">
                      <i className="bi bi-newspaper me-1"></i> News
                    </NavLink>
                    <NavLink to="/community/discussions">
                      <i className="bi bi-chat-dots me-1"></i> Discussions
                    </NavLink>
                    <NavLink to="/community/help-requests">
                      <i className="bi bi-people me-1"></i> Help Requests
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/community">
                    <i className="bi bi-house-door me-1"></i> Community
                  </NavLink>
                )}
                <NavLink to="/auth/profile">
                  <i className="bi bi-person-circle me-1"></i> Profile
                </NavLink>
                <Nav.Link onClick={handleLogout} className="nav-link px-3">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <main className="flex-grow-1">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/auth/*"
                  element={
                    !isLoggedIn ? (
                      <AuthApp onLoginSuccess={checkAuth} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route
                  path="/community/*"
                  element={
                    <PrivateRoute>
                      <CommunityApp />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        {isLoggedIn && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                <ApolloProvider client={apolloClient}>
                  <AIChatbot />
                </ApolloProvider>
              </div>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </Router>
  );
}

export default App; 