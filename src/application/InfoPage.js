import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import '../style/InfoPage.css';
import '../style/style.css';

const InfoPage = () => {
  const { username, userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }
        const userData = await response.json();
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleReturnHome = () => {
    navigate(`/home/${username}`);
  };

  return (
    <div className="container">
      <h2>User Info</h2>
      {userInfo ? (
        <div>
          <p>Username: {userInfo.username}</p>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <h3>Address</h3>
          <p>Street: {userInfo.address.street}</p>
          <p>Suite: {userInfo.address.suite}</p>
          <p>City: {userInfo.address.city}</p>
          <p>Zipcode: {userInfo.address.zipcode}</p>
          <p>Geo: {userInfo.address.geo.lat}, {userInfo.address.geo.lng}</p>
          <p>Phone: {userInfo.phone}</p>
          <h3>Company</h3>
          <p>Name: {userInfo.company.name}</p>
          <p>Catch Phrase: {userInfo.company.catchPhrase}</p>
          <p>Business: {userInfo.company.bs}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
};

export default InfoPage;


//import React from 'react';

//const InfoPage = () => {
// return <div>hello you in page Info</div>;
//};

//export default InfoPage;
