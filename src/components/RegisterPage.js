import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * RegisterPage component handles user registration.
 * It allows the user to enter a username and website, and verifies the website entry.
 */
const RegisterPage = () => {
  const [username, setUsername] = useState(''); // State to hold the username input
  const [website, setWebsite] = useState(''); // State to hold the website input
  const [websiteVerify, setWebsiteVerify] = useState(''); // State to hold the website verification input
  const [error, setError] = useState(null); // State to hold any error messages
  const navigate = useNavigate(); // Hook to navigate programmatically

  /**
   * Handles the registration process.
   * Checks if the website entries match and if the username already exists.
   * Navigates to the complete profile page if successful.
   * @param {Object} e - The form submit event.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (website !== websiteVerify) {
      setError('Websites do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      const existingUser = users.find(user => user.username === username);

      if (existingUser) {
        setError('Username already exists');
      } else {
        // Navigate to complete profile page with username and website parameters
        navigate(`/complete-profile/${username}/${website}`);
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Website: </label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Verify Website: </label>
          <input
            type="text"
            value={websiteVerify}
            onChange={(e) => setWebsiteVerify(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default RegisterPage;
