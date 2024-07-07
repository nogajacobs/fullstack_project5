import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CompleteProfilePage from './components/CompleteProfilePage';
import HomePage from './components/HomePage';
import TodosPage from './application/TodosPage';
import PostsPage from './application/PostsPage';
import AlbumsPage from './application/AlbumsPage';
import InfoPage from './application/InfoPage';
import PhotosPage from './application/PhotosPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete-profile/:username/:website" element={<CompleteProfilePage />} />
        <Route path="/home/:username" element={<HomePage />} />
        <Route path="/home/:username/todos/:userId" element={<TodosPage />} />
        <Route path="/home/:username/posts/:userId" element={<PostsPage />} />
        <Route path="/home/:username/albums/:userId" element={<AlbumsPage />} />
        <Route path="/home/:username/info/:userId" element={<InfoPage />} />
        <Route path="/home/:username/albums/:userId/Photos/:albumId" element={<PhotosPage />} />
      </Routes>
    </div>
  );
}

export default App;
