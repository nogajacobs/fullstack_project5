import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../style/LoginPage.css';
import '../style/style.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleWebsiteChange = (event) => {
    setWebsite(event.target.value);
  };

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

      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(`/home/${username}`);
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during login");
    }
  };

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
