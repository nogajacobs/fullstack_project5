import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../style/PostsPage.css';
import '../style/style.css';

const PostsPage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;
  const username = currentUser.name;
  const userEmail = currentUser.email;

  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ id: '', title: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostTitle, setEditingPostTitle] = useState('');
  const [editingPostContent, setEditingPostContent] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const filteredData = data.filter(post =>
          (!searchCriteria.id || post.id.toString().includes(searchCriteria.id)) &&
          (!searchCriteria.title || post.title.toLowerCase().includes(searchCriteria.title.toLowerCase()))
        );
        setPosts(filteredData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [userId, searchCriteria]);

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prevCriteria => ({ ...prevCriteria, [name]: value }));
  };

  const getMaxId = (arr) => {
    const maxId = arr.reduce((max, item) => (parseInt(item.id) > max ? parseInt(item.id) : max), 0);
    return (maxId + 1).toString();
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: parseInt(userId),
      id: getMaxId(posts),
      title: newPostTitle,
      body: newPostContent,
    };
    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error('Failed to add new post');
      }
      setPosts([...posts, newPost]);
      setNewPostTitle('');
      setNewPostContent('');
    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditingPostTitle(post.title);
    setEditingPostContent(post.body);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/posts/${editingPostId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingPostTitle, body: editingPostContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      setPosts(posts.map(post =>
        post.id === editingPostId ? { ...post, title: editingPostTitle, body: editingPostContent } : post
      ));
      setEditingPostId(null);
      setEditingPostTitle('');
      setEditingPostContent('');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleSelectPost = (postId) => {
    setSelectedPostId(postId);
    fetchComments(postId);
  };

  const handleAddComment = async (postId) => {
    const newCommentData = {
      postId,
      id: getMaxId(comments),
      name: username,
      email: userEmail,
      body: newComment,
    };
    try {
      const response = await fetch('http://localhost:3001/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentData),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, updatedBody) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: updatedBody }),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, body: updatedBody } : comment
      ));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div>
      <h2>Posts List</h2>
      <form>
        <input
          type="text"
          name="id"
          value={searchCriteria.id}
          onChange={handleSearchChange}
          placeholder="Search by ID"
        />
        <input
          type="text"
          name="title"
          value={searchCriteria.title}
          onChange={handleSearchChange}
          placeholder="Search by Title"
        />
      </form>
      <form onSubmit={handleAddPost}>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="New Post Title"
          required
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="New Post Content"
          required
        />
        <button type="submit">Add Post</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {editingPostId === post.id ? (
              <form onSubmit={handleUpdatePost}>
                <input
                  type="text"
                  value={editingPostTitle}
                  onChange={(e) => setEditingPostTitle(e.target.value)}
                  required
                />
                <textarea
                  value={editingPostContent}
                  onChange={(e) => setEditingPostContent(e.target.value)}
                  required
                />
                <button type="submit">Update Post</button>
              </form>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => handleEditPost(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                <button onClick={() => handleSelectPost(post.id)}>View Comments</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {selectedPostId && (
        <div>
          <h3>Comments for Post {selectedPostId}</h3>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>
                <p><strong>{comment.name}</strong>: {comment.body}</p>
                {comment.email === userEmail && (
                  <>
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    <button onClick={() => handleUpdateComment(comment.id, prompt('Update comment:', comment.body))}>Update</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <form onSubmit={(e) => { e.preventDefault(); handleAddComment(selectedPostId); }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="New Comment"
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      )}
       <button onClick={() => navigate(`/home/${currentUser.username}`)}>Return to Home</button>
    </div>
  );
};

export default PostsPage;