import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Image, Badge, Tab, Nav, ListGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { gql, useQuery } from '@apollo/client';

// Query to get user's posts and help requests
const GET_USER_ACTIVITY = gql`
  query GetUserActivity($userId: ID!) {
    me {
      id
      username
      email
      role
      createdAt
    }
    communityPosts(userId: $userId) {
      id
      title
      content
      category
      createdAt
    }
    helpRequests(userId: $userId) {
      id
      description
      location
      createdAt
    }
  }
`;

function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add console logging to debug user ID
  console.log('Current user ID:', user?.id);
  
  const { data, loading, error } = useQuery(GET_USER_ACTIVITY, {
    variables: { userId: user?.id },
    skip: !user?.id, // Skip the query if we don't have a user ID
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error("GraphQL Error:", error);
    }
  });

  useEffect(() => {
    if (data) {
      console.log("Received data:", data);
    }
  }, [data]);

  // Calculate post counts
  const newsPosts = data?.communityPosts?.filter(post => post.category === 'news') || [];
  const discussionPosts = data?.communityPosts?.filter(post => post.category === 'discussion') || [];
  const helpRequests = data?.helpRequests || [];

  // Add console logging for debugging
  console.log('Activity Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);
  
  // Default avatar based on first letter of username
  const getInitialAvatar = () => {
    const colors = [
      '#3498db', '#9b59b6', '#e74c3c', '#2ecc71', '#f39c12', 
      '#1abc9c', '#34495e', '#d35400', '#27ae60', '#2980b9'
    ];
    const initial = user.username.charAt(0).toUpperCase();
    const colorIndex = initial.charCodeAt(0) % colors.length;
    
    return (
      <div 
        className="rounded-circle d-flex justify-content-center align-items-center"
        style={{ 
          width: '100px', 
          height: '100px', 
          backgroundColor: colors[colorIndex],
          fontSize: '2.5rem',
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        {initial}
      </div>
    );
  };
  
  // Role badge with appropriate color
  const getRoleBadge = () => {
    const roleMap = {
      'resident': { color: 'primary', icon: 'bi-house-door' },
      'business_owner': { color: 'success', icon: 'bi-shop' },
      'community_organizer': { color: 'warning', icon: 'bi-people' }
    };
    
    const roleStyle = roleMap[user.role] || { color: 'secondary', icon: 'bi-person' };
    
    return (
      <Badge bg={roleStyle.color} className="fs-6 py-2 px-3">
        <i className={`bi ${roleStyle.icon} me-2`}></i>
        {user.role.replace('_', ' ')}
      </Badge>
    );
  };
  
  // Calculate join date
  const formatJoinDate = () => {
    const date = user.createdAt ? new Date(parseInt(user.createdAt)) : new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm overflow-hidden">
        {/* Header with background */}
        <div className="bg-primary text-white p-5 mb-4">
          <h1 className="display-5 fw-bold">{user.username}'s Profile</h1>
          <p className="fs-5">Member since {formatJoinDate()}</p>
        </div>
        
        <Card.Body className="px-4">
          <Row>
            {/* Left column - Profile basics */}
            <Col md={4} className="text-center mb-4">
              <div className="d-flex flex-column align-items-center">
                {getInitialAvatar()}
                <h3 className="mt-3 mb-1">{user.username}</h3>
                <p className="text-muted mb-3">{user.email}</p>
                {getRoleBadge()}
              </div>
              
              <div className="mt-4">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h5 className="card-title mb-3">Activity Summary</h5>
                    <Row className="text-center g-2">
                      <Col xs={6}>
                        <div className="p-3 rounded bg-white shadow-sm">
                          <h2 className="fs-3 mb-1">{newsPosts.length}</h2>
                          <p className="text-muted small mb-0">News Posts</p>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="p-3 rounded bg-white shadow-sm">
                          <h2 className="fs-3 mb-1">{helpRequests.length}</h2>
                          <p className="text-muted small mb-0">Help Requests</p>
                        </div>
                      </Col>
                      <Col xs={12} className="mt-2">
                        <Button variant="outline-danger" onClick={logout} className="w-100 mt-3">
                          <i className="bi bi-box-arrow-right me-2"></i>Logout
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            
            {/* Right column - Tabs with activity */}
            <Col md={8}>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="overview" className="d-flex align-items-center">
                      <i className="bi bi-grid me-2"></i> Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="posts" className="d-flex align-items-center">
                      <i className="bi bi-file-text me-2"></i> Posts
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="help-requests" className="d-flex align-items-center">
                      <i className="bi bi-hand-thumbs-up me-2"></i> Help Requests
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings" className="d-flex align-items-center">
                      <i className="bi bi-gear me-2"></i> Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="overview">
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Body>
                        <h4>Welcome, {user.username}!</h4>
                        <p>Here's a quick overview of your community presence:</p>
                        
                        <div className="p-3 bg-light rounded mb-3">
                          <h5 className="mb-3">Your Community Badges</h5>
                          <div className="d-flex flex-wrap gap-2">
                            {getRoleBadge()}
                            <Badge bg="info" className="fs-6 py-2 px-3">
                              <i className="bi bi-calendar-check me-2"></i> Active Member
                            </Badge>
                            {newsPosts.length > 0 && (
                              <Badge bg="primary" className="fs-6 py-2 px-3">
                                <i className="bi bi-newspaper me-2"></i> News Contributor
                              </Badge>
                            )}
                            {helpRequests.length > 0 && (
                              <Badge bg="success" className="fs-6 py-2 px-3">
                                <i className="bi bi-people me-2"></i> Community Helper
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-around text-center mt-4">
                          <div>
                            <h3 className="h2 mb-0">{newsPosts.length}</h3>
                            <p className="text-muted">News Posts</p>
                          </div>
                          <div>
                            <h3 className="h2 mb-0">{discussionPosts.length}</h3>
                            <p className="text-muted">Discussions</p>
                          </div>
                          <div>
                            <h3 className="h2 mb-0">{helpRequests.length}</h3>
                            <p className="text-muted">Help Requests</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                    
                    <h5 className="mb-3">Recently Active</h5>
                    {loading ? (
                      <p className="text-center">Loading your recent activity...</p>
                    ) : error ? (
                      <Alert variant="info">
                        Your recent activity will appear here once you start interacting with the community.
                      </Alert>
                    ) : (
                      <ListGroup variant="flush" className="border rounded">
                        {newsPosts.slice(0, 3).map(post => (
                          <ListGroup.Item key={post.id} className="d-flex justify-content-between align-items-center">
                            <div>
                              <i className={`bi ${post.category === 'news' ? 'bi-newspaper' : 'bi-chat-dots'} me-2`}></i>
                              {post.title}
                            </div>
                            <Badge bg="secondary">
                              {new Date(parseInt(post.createdAt)).toLocaleDateString()}
                            </Badge>
                          </ListGroup.Item>
                        ))}
                        {helpRequests.slice(0, 2).map(request => (
                          <ListGroup.Item key={request.id} className="d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bi bi-hand-thumbs-up me-2"></i>
                              {request.description.length > 40 
                                ? request.description.substring(0, 40) + '...' 
                                : request.description}
                            </div>
                            <div>
                              {request.isResolved ? (
                                <Badge bg="success">Resolved</Badge>
                              ) : (
                                <Badge bg="warning">Active</Badge>
                              )}
                            </div>
                          </ListGroup.Item>
                        ))}
                        {(!newsPosts.length && !helpRequests.length) && (
                          <ListGroup.Item className="text-center text-muted py-4">
                            No activity yet. Start posting or helping in the community!
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="posts">
                    <h4 className="mb-3">Your Community Posts</h4>
                    {loading ? (
                      <p className="text-center">Loading your posts...</p>
                    ) : error ? (
                      <Alert variant="info">
                        Your posts will appear here once you create them in the community.
                      </Alert>
                    ) : (
                      <div>
                        {newsPosts.length ? (
                          <ListGroup variant="flush" className="border rounded">
                            {newsPosts.map(post => (
                              <ListGroup.Item key={post.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                  <Badge bg="info" className="me-2">
                                    {post.category}
                                  </Badge>
                                  {post.title}
                                </div>
                                <small className="text-muted">
                                  {new Date(parseInt(post.createdAt)).toLocaleDateString()}
                                </small>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <Alert variant="light" className="text-center">
                            <i className="bi bi-pencil-square fs-1 d-block mb-3"></i>
                            <p>You haven't created any posts yet.</p>
                            <Button variant="outline-primary" href="/community/create-post">
                              Create Your First Post
                            </Button>
                          </Alert>
                        )}
                      </div>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="help-requests">
                    <h4 className="mb-3">Your Help Requests</h4>
                    {loading ? (
                      <p className="text-center">Loading your help requests...</p>
                    ) : error ? (
                      <Alert variant="info">
                        Your help requests will appear here once you create them in the community.
                      </Alert>
                    ) : (
                      <div>
                        {helpRequests.length ? (
                          <ListGroup variant="flush" className="border rounded">
                            {helpRequests.map(request => (
                              <ListGroup.Item key={request.id}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <h6 className="mb-0">{request.description}</h6>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <small className="text-muted">
                                    Created on {new Date(parseInt(request.createdAt)).toLocaleDateString()}
                                  </small>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <Alert variant="light" className="text-center">
                            <i className="bi bi-hand-thumbs-up fs-1 d-block mb-3"></i>
                            <p>You haven't created any help requests yet.</p>
                            <Button variant="outline-primary" href="/community/create-help-request">
                              Create Help Request
                            </Button>
                          </Alert>
                        )}
                      </div>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="settings">
                    <Card className="border-0 shadow-sm">
                      <Card.Body>
                        <h4 className="mb-4">Account Settings</h4>
                        
                        <div className="mb-4">
                          <h5 className="mb-3">Personal Information</h5>
                          <p className="text-muted small">
                            Update your profile information. For security reasons, contact an administrator
                            if you need to change your email address.
                          </p>
                          
                          <div className="d-flex justify-content-between mb-3 p-3 border rounded">
                            <div>
                              <strong>Username</strong>
                              <p className="mb-0">{user.username}</p>
                            </div>
                            <Button variant="outline-secondary" size="sm" disabled>
                              Edit
                            </Button>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-3 p-3 border rounded">
                            <div>
                              <strong>Email</strong>
                              <p className="mb-0">{user.email}</p>
                            </div>
                            <Button variant="outline-secondary" size="sm" disabled>
                              Edit
                            </Button>
                          </div>
                          
                          <div className="d-flex justify-content-between p-3 border rounded">
                            <div>
                              <strong>Role</strong>
                              <p className="mb-0">{user.role.replace('_', ' ')}</p>
                            </div>
                            <Button variant="outline-secondary" size="sm" disabled>
                              Request Change
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h5 className="mb-3">Security</h5>
                          <p className="text-muted small">
                            Manage your account security settings.
                          </p>
                          <Button variant="outline-primary" className="mb-3" disabled>
                            <i className="bi bi-shield-lock me-2"></i>
                            Change Password
                          </Button>
                          
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="emailNotifications" disabled/>
                            <label className="form-check-label" htmlFor="emailNotifications">
                              Enable Two-Factor Authentication (Coming Soon)
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="mb-3">Notification Preferences</h5>
                          <p className="text-muted small">
                            Control how you receive notifications from the community.
                          </p>
                          
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked disabled/>
                            <label className="form-check-label" htmlFor="emailNotifications">
                              Email Notifications
                            </label>
                          </div>
                          
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="discussionReplies" defaultChecked disabled/>
                            <label className="form-check-label" htmlFor="discussionReplies">
                              Discussion Replies
                            </label>
                          </div>
                          
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="helpRequestUpdates" defaultChecked disabled/>
                            <label className="form-check-label" htmlFor="helpRequestUpdates">
                              Help Request Updates
                            </label>
                          </div>
                          
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="newsPostNotifications" defaultChecked disabled/>
                            <label className="form-check-label" htmlFor="newsPostNotifications">
                              News Post Notifications
                            </label>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile; 