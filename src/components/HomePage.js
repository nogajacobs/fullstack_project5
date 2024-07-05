import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from local storage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    // Clear current user from local storage
    localStorage.removeItem('currentUser');
    // Navigate to the login page or any other appropriate page
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      {currentUser && (
        <div>
          <h3>User Details</h3>
          <p>Username: {currentUser.username}</p>
          <p>Name: {currentUser.name}</p>
          <p>Email: {currentUser.email}</p>
          {/* Display other user details as needed */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
