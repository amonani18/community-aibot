import React, { useState, useRef, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { ChatDots, Send, Robot, X } from 'react-bootstrap-icons';

const COMMUNITY_AI_QUERY = gql`
  query CommunityAIQuery($input: String!) {
    communityAIQuery(input: $input) {
      text
      suggestedQuestions
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

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { refetch } = useQuery(COMMUNITY_AI_QUERY, {
    skip: true,
    onCompleted: (data) => {
      if (data?.communityAIQuery) {
        const { text, suggestedQuestions, retrievedPosts } = data.communityAIQuery;
        setMessages(prev => [
          ...prev,
          {
            type: 'ai',
            content: text,
            suggestedQuestions,
            retrievedPosts
          }
        ]);
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
          suggestedQuestions: [],
          retrievedPosts: []
        }
      ]);
      setIsLoading(false);
    }
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

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      await refetch({ input });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    setInput(question);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
          style={{
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            zIndex: 1000
          }}
        >
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Robot className="me-2" />
              <span>AI Assistant</span>
            </div>
            <Button
              variant="link"
              className="text-white p-0"
              onClick={toggleChat}
            >
              <X size={20} />
            </Button>
          </Card.Header>
          <Card.Body className="p-0" style={{ overflowY: 'auto' }}>
            <div className="p-3">
              {messages.map((message, index) => (
                <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-end' : ''}`}>
                  <div
                    className={`d-inline-block p-2 rounded-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-light border'
                    }`}
                    style={{ maxWidth: '80%', fontSize: '0.9rem' }}
                  >
                    <p className="mb-1">{message.content}</p>
                    {message.type === 'ai' && message.suggestedQuestions?.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Suggested questions:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {message.suggestedQuestions.map((question, qIndex) => (
                            <Badge
                              key={qIndex}
                              bg="secondary"
                              className="cursor-pointer"
                              onClick={() => handleSuggestedQuestionClick(question)}
                              style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                            >
                              {question}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {message.type === 'ai' && message.retrievedPosts?.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Related discussions:</small>
                        <ListGroup variant="flush" className="mt-1">
                          {message.retrievedPosts.map((post) => (
                            <ListGroup.Item key={post.id} className="py-1">
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
              {isLoading && (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Card.Body>
          <Card.Footer className="p-2">
            <Form onSubmit={handleSubmit}>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  size="sm"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
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