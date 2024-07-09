import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage component handles user login.
 * It allows the user to enter a username and website for authentication.
 */
const LoginPage = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [username, setUsername] = useState(''); // State to hold the username input
  const [website, setWebsite] = useState(''); // State to hold the website input
  const [errorMessage, setErrorMessage] = useState(''); // State to hold any error messages

  /**
   * Handles changes in the username input field.
   * @param {Object} event - The input change event.
   */
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  /**
   * Handles changes in the website input field.
   * @param {Object} event - The input change event.
   */
  const handleWebsiteChange = (event) => {
    setWebsite(event.target.value);
  };

  /**
   * Handles the login process.
   * Fetches user data from the server and validates the username and website.
   * @param {Object} e - The form submit event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !website) {
      setErrorMessage("Username and website are required");
      return;
    }
    try {
      const url = `http://localhost:3001/users?username=${username}`;
      const response = await fetch(url);
      if (!response.ok) {
        setErrorMessage("Authentication failed");
        return;
      }
      const users = await response.json();
      if (users.length === 0) {
        setErrorMessage("Username not found");
        return;
      }
      const user = users.find((user) => user.website === website);
      if (!user) {
        setErrorMessage("Invalid username or website");
        return;
      }

      // Store the user data in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(`/home/${username}`); // Navigate to the home page
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during login");
    }
  };

  /**
   * Handles the navigation to the registration page.
   */
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="website">Website:</label>
          <input
            type="password"
            id="website"
            value={website}
            onChange={handleWebsiteChange}
            required
          />
        </div>
        <h4 className="error-message">{errorMessage}</h4>
        <div className="login-buttons">
          <button type="submit">Login</button>
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
