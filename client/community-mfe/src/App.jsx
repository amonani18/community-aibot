import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import { Routes, Route, Navigate } from 'react-router-dom';
import NewsList from './components/NewsList';
import DiscussionList from './components/DiscussionList';
import HelpRequestList from './components/HelpRequestList';
import HelpRequestDetail from './components/HelpRequestDetail';
import CreatePost from './components/CreatePost';
import CreateNewsPost from './components/CreateNewsPost';
import CreateDiscussionPost from './components/CreateDiscussionPost';
import CreateHelpRequest from './components/CreateHelpRequest';
import EditPost from './components/EditPost';
import PostDetail from './components/PostDetail';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="container py-4">
        <Routes>
          <Route index element={<NewsList />} />
          <Route path="news" element={<NewsList />} />
          <Route path="news/post/:postId" element={<PostDetail />} />
          <Route path="discussions" element={<DiscussionList />} />
          <Route path="discussions/post/:postId" element={<PostDetail />} />
          <Route path="help-requests" element={<HelpRequestList />} />
          <Route path="help-requests/request/:requestId" element={<HelpRequestDetail />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="create-news" element={<CreateNewsPost />} />
          <Route path="create-discussion" element={<CreateDiscussionPost />} />
          <Route path="create-help-request" element={<CreateHelpRequest />} />
          <Route path="edit-post/:postId" element={<EditPost />} />
          <Route path="post/:postId" element={<PostDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;
