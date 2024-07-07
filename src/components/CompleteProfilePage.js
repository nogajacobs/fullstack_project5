import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import '../style/CompleteProfilePage.css';
import '../style/style.css';

const CompleteProfilePage = () => {
  const { username, website } = useParams();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [catchPhrase, setCatchPhrase] = useState('');
  const [bs, setBs] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('username', username);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('street', street);
    formData.append('suite', suite);
    formData.append('city', city);
    formData.append('zipcode', zipcode);
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('phone', phone);
    formData.append('website', website);
    formData.append('companyName', companyName);
    formData.append('catchPhrase', catchPhrase);
    formData.append('bs', bs);

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("currentUser", JSON.stringify(data));
        navigate(`/home/${username}`);
      } else {
        alert('Registration completion failed');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="user-details">
        <h2>Complete Profile for {username}</h2>
        <p>Website: {website}</p>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter user ID"
            required
          />
        </div>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="form-group">
          <label>Street:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Suite:</label>
          <input
            type="text"
            value={suite}
            onChange={(e) => setSuite(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Zipcode:</label>
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Catch Phrase:</label>
          <input
            type="text"
            value={catchPhrase}
            onChange={(e) => setCatchPhrase(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>BS:</label>
          <input
            type="text"
            value={bs}
            onChange={(e) => setBs(e.target.value)}
          />
        </div>
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;
