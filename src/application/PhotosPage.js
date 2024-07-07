import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import '../style/PhotosPage.css';
import '../style/style.css';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { username, userId, albumId } = useParams();

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}&_page=${page}&_limit=3`);
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(prevPhotos => [...prevPhotos, ...data]);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [page, albumId]);

  const loadMorePhotos = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleAddPhoto = async () => {
    // Implement functionality to add a photo to the album
    console.log('Adding a new photo to album:', albumId);
  };

  const handleDeletePhoto = async (photoId) => {
    // Implement functionality to delete a photo from the album
    console.log('Deleting photo:', photoId);
  };

  const handleUpdatePhoto = async (photoId) => {
    // Implement functionality to update a photo in the album
    console.log('Updating photo:', photoId);
  };

  return (
    <div className="photos-container">
      <h2>Photos</h2>
      <div className="photos-list">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
            <button onClick={() => handleDeletePhoto(photo.id)}>Delete Photo</button>
            <button onClick={() => handleUpdatePhoto(photo.id)}>Update Photo</button>
          </div>
        ))}
      </div>
      <div className="load-more-button">
        <button onClick={loadMorePhotos} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Photos'}
        </button>
      </div>
      <button onClick={handleAddPhoto}>Add Photo</button>
      <button onClick={() => navigate(`/home/${username}/albums/${userId}`)}>Return to Albums</button>   
    </div>
  );
};

export default PhotosPage;
