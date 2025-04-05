import React from 'react';
import { Nav, Container, Button, Badge, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

// Query to get count of posts by category 
const GET_POST_COUNTS = gql`
  query GetPostCounts {
    newsPosts: communityPosts(category: "news") {
      id
    }
    discussionPosts: communityPosts(category: "discussion") {
      id
    }
    helpRequests {
      id
    }
  }
`;

function CommunityNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  // Determine active tab based on current path
  const isNewsActive = path === '/' || path === '/news' || path.includes('/news/') || path.endsWith('/');
  const isDiscussionsActive = path.includes('/discussions');
  const isHelpRequestsActive = path.includes('/help-requests');
  
  // Optional: Fetch counts - this may fail if backend doesn't support these filters yet
  const { data } = useQuery(GET_POST_COUNTS, {
    onError: () => {
      // Silently handle error - this is expected if backend doesn't support these queries yet
    }
  });
  
  // Dropdown handler for create content
  const handleCreateOption = (option) => {
    switch(option) {
      case 'news':
        navigate('/create-news');
        break;
      case 'discussion':
        navigate('/create-discussion');
        break;
      case 'help':
        navigate('/create-help-request');
        break;
      default:
        navigate('/create-post');
    }
  };
  
  return (
    <div className="community-nav mb-4">
      <Container className="d-flex justify-content-between align-items-center">
        <Nav className="community-navigation">
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="news" 
              active={isNewsActive}
              className="d-flex align-items-center"
            >
              <i className="bi bi-newspaper me-2"></i> News
              {data?.newsPosts && (
                <Badge bg="info" pill className="ms-2">
                  {data.newsPosts.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="discussions" 
              active={isDiscussionsActive}
              className="d-flex align-items-center"
            >
              <i className="bi bi-chat-dots me-2"></i> Discussions
              {data?.discussionPosts && (
                <Badge bg="primary" pill className="ms-2">
                  {data.discussionPosts.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="help-requests" 
              active={isHelpRequestsActive}
              className="d-flex align-items-center"
            >
              <i className="bi bi-people me-2"></i> Help Requests
              {data?.helpRequests && (
                <Badge bg="warning" pill className="ms-2">
                  {data.helpRequests.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="profile" 
              active={path.includes('/profile')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-person me-2"></i> Profile
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Dropdown>
          <Dropdown.Toggle variant="primary" className="rounded-pill">
            <i className="bi bi-plus-lg me-2"></i> Create
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" className="shadow-sm border-0">
            <Dropdown.Item onClick={() => handleCreateOption('news')}>
              <i className="bi bi-newspaper me-2 text-info"></i> News Post
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCreateOption('discussion')}>
              <i className="bi bi-chat-dots me-2 text-primary"></i> Discussion
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCreateOption('help')}>
              <i className="bi bi-people me-2 text-warning"></i> Help Request
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </div>
  );
}

export default CommunityNavigation; 