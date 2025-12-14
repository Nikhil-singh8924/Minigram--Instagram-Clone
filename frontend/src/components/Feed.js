import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import './feed.css';


function Feed() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  const loadFollowing = async () => {
    try {
      const res = await fetch('http://localhost:5000/users');
      const users = await res.json();
      const currentUser = users.find(u => u.username === username);
      setFollowing(currentUser.following || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/posts');
      const allPosts = await res.json();
      const filteredPosts = allPosts.filter(
        p => following.includes(p.username) || p.username === username
      );
      setPosts(filteredPosts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFollowing();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [following]);

  // Like and Delete handlers
  const handleLike = async (postId) => {
    try {
      await fetch('http://localhost:5000/posts/toggle-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, username })
      });
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await fetch(`http://localhost:5000/posts/${postId}`, {
        method: 'DELETE'
      });
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="feed-container">
    <h2 className="feed-title">Feed</h2>

     {/* Button to go to Profile  */}
      <button 
      className="profile-btn"
      onClick={() => navigate('/profile')} > Go to Profile
       </button>


    {posts.length === 0 ? (
      <p>No posts to show.</p>
    ) : (
      posts.map(p => (
        <PostCard
          key={p.id}
          post={p}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))
    )}
  </div>
);
}

export default Feed;
