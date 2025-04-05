import React, { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { ChatDots, Send, Robot, X, ArrowsAngleExpand, ArrowsAngleContract } from 'react-bootstrap-icons';

const COMMUNITY_AI_QUERY = gql`
  query CommunityAIQuery($input: String!) {
    communityAIQuery(input: $input) {
      text
      retrievedPosts {
        id
        title
        content
        category
        author {
          username
        }
        createdAt
      }
    }
  }
`;

// Initial suggested questions
const INITIAL_QUESTIONS = [
  "What's new in the community?",
  "Can you help me find recent discussions?",
  "What topics are trending?",
  "How can I get involved in the community?",
  "Tell me about recent events"
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialQuestions, setShowInitialQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  const [executeQuery] = useLazyQuery(COMMUNITY_AI_QUERY, {
    onCompleted: (data) => {
      if (data?.communityAIQuery) {
        const { text, retrievedPosts } = data.communityAIQuery;
        setMessages(prev => [
          ...prev,
          {
            type: 'ai',
            content: text,
            retrievedPosts
          }
        ]);
        setShowInitialQuestions(false);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          retrievedPosts: []
        }
      ]);
      setIsLoading(false);
    },
    fetchPolicy: 'network-only'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setMessages(prev => [...prev, { type: 'user', content: userInput }]);
    setInput('');
    setIsLoading(true);
    setShowInitialQuestions(false);

    try {
      executeQuery({ variables: { input: userInput } });
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: 'Sorry, something went wrong. Please try again.',
          retrievedPosts: []
        }
      ]);
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    setInput(question);
    setShowInitialQuestions(false);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setShowInitialQuestions(true);
      if (messages.length === 0) {
        setMessages([{
          type: 'ai',
          content: "Hi! I'm your AI assistant. How can I help you today?",
          retrievedPosts: []
        }]);
      }
    }
    setIsOpen(!isOpen);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const getChatWindowStyle = () => {
    const baseStyle = {
      zIndex: 1000,
      transition: 'all 0.3s ease'
    };

    if (isMaximized) {
      return {
        ...baseStyle,
        bottom: '90px',
        right: '20px',
        width: '600px',
        height: '700px',
        maxWidth: '80vw',
        maxHeight: '80vh'
      };
    }

    return {
      ...baseStyle,
      bottom: '90px',
      right: '20px',
      width: '350px',
      height: '500px'
    };
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className="position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChatDots size={24} />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="position-fixed shadow"
          style={getChatWindowStyle()}
        >
          <Card.Header 
            className="bg-primary text-white d-flex justify-content-between align-items-center"
            style={{ position: 'sticky', top: 0, zIndex: 1001 }}
          >
            <div className="d-flex align-items-center">
              <Robot className="me-2" />
              <span>AI Assistant</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="link"
                className="text-white p-1 d-flex align-items-center"
                onClick={toggleMaximize}
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? <ArrowsAngleContract size={20} /> : <ArrowsAngleExpand size={20} />}
              </Button>
              <Button
                variant="link"
                className="text-white p-1 d-flex align-items-center"
                onClick={toggleChat}
              >
                <X size={20} />
              </Button>
            </div>
          </Card.Header>
          <Card.Body 
            className="p-3" 
            style={{ 
              overflowY: 'auto',
              height: isMaximized ? 'calc(100% - 120px)' : '400px',
              backgroundColor: '#f8f9fa'
            }}
          >
            {messages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-end' : ''}`}>
                <div
                  className={`d-inline-block p-3 rounded-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white border'
                  }`}
                  style={{ 
                    maxWidth: '80%', 
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <p className="mb-1">{message.content}</p>
                  {message.type === 'ai' && message.retrievedPosts?.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2">Related discussions:</small>
                      <ListGroup variant="flush" className="mt-1">
                        {message.retrievedPosts.map((post) => (
                          <ListGroup.Item 
                            key={post.id} 
                            className="py-2 px-3 rounded-2 mb-1"
                            style={{ backgroundColor: '#f8f9fa' }}
                          >
                            <small style={{ fontSize: '0.8rem' }}>
                              <strong>{post.title}</strong> by {post.author.username}
                            </small>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {showInitialQuestions && (
              <div className="mt-3">
                <small className="text-muted d-block mb-2">Suggested questions:</small>
                <div className="d-flex flex-wrap gap-2">
                  {INITIAL_QUESTIONS.map((question, index) => (
                    <Badge
                      key={index}
                      bg="primary"
                      className="cursor-pointer"
                      onClick={() => handleSuggestedQuestionClick(question)}
                      style={{ 
                        cursor: 'pointer', 
                        fontSize: '0.8rem',
                        padding: '8px 12px',
                        fontWeight: 'normal'
                      }}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {isLoading && (
              <div className="text-center p-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>
          <Card.Footer 
            className="p-2 bg-white" 
            style={{ 
              position: 'sticky', 
              bottom: 0,
              borderTop: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <Form onSubmit={handleSubmit}>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  size="sm"
                  style={{ fontSize: '0.9rem' }}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()} 
                  size="sm"
                  variant="primary"
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: '40px' }}
                >
                  <Send size={16} />
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default AIChatbot; 