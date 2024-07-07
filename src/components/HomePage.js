import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../style/HomePage.css';
import '../style/style.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome, {currentUser ? currentUser.name : 'Guest'}</h2>
      <div>
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
