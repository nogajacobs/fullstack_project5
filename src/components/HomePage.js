import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * HomePage component serves as the main landing page after user logs in.
 * It displays a welcome message and provides navigation to various sections
 * like Info, Todos, Posts, and Albums. It also allows the user to logout.
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  // useEffect to update currentUser state if 'currentUser' is found in localStorage
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  /**
   * handleLogout function clears the currentUser from localStorage and navigates to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome, {currentUser ? currentUser.name : 'Guest'}</h2>
      <div>
        {/* Buttons for navigating to different sections based on the current user's information */}
        <button onClick={() => navigate(`/home/${currentUser.username}/info/${currentUser.id}`)}>Info</button>
        <button onClick={() => navigate(`/home/${currentUser.username}/todos/${currentUser.id}`)}>Todos</button>
        <button onClick={() => navigate(`/home/${currentUser.username}/posts/${currentUser.id}`)}>Posts</button>
        <button onClick={() => navigate(`/home/${currentUser.username}/albums/${currentUser.id}`)}>Albums</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default HomePage;
