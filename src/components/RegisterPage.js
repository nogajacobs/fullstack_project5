import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [websiteVerify, setWebsiteVerify] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
