import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CreatePost() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the type from the location state, or default to "news"
  const postType = location.state?.defaultCategory || "news";
  
  // On component mount, redirect to the specific create page
  useEffect(() => {
    if (postType === "discussion") {
      // Navigate to create discussion page with any state parameters
      navigate('../create-discussion', { state: location.state });
    } else {
      // Navigate to create news page with any state parameters
      navigate('../create-news', { state: location.state });
    }
  }, [navigate, postType, location.state]);
  
  // This component will rarely render, as it redirects immediately
  return (
    <div className="text-center py-5">
      <p>Redirecting to create {postType} page...</p>
    </div>
  );
}

export default CreatePost; 