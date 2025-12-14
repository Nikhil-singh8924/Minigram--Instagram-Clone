import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function Profile() {
  const username = localStorage.getItem('username'); // logged-in user
  const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };


  const [posts, setPosts] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [users, setUsers] = useState([]); // all users
  const [following, setFollowing] = useState([]); // current user's following
  const [followersCount, setFollowersCount] = useState(0);

  // Load posts by this user
  const loadPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/posts');
      const data = await res.json();
      setPosts(data.filter(p => p.username === username));
    } catch (err) {
      console.error(err);
    }
  };

  // Load all users
  const loadUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/users');
      const data = await res.json();
      setUsers(data.filter(u => u.username !== username));

      // Get the logged-in user's following list
      const currentUser = data.find(u => u.username === username);
      setFollowing(currentUser.following || []);

      // Compute followers count
      const followers = data.filter(u => u.following.includes(username));
      setFollowersCount(followers.length);
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new post
  const createPost = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    try {
      await fetch('http://localhost:5000/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, imageUrl, caption })
      });
      setImageUrl('');
      setCaption('');
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Follow a user
  const followUser = async (userToFollow) => {
    try {
      await fetch('http://localhost:5000/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, followUsername: userToFollow })
      });
      setFollowing(prev => [...prev, userToFollow]);
      loadUsers(); // reload to update followers count
    } catch (err) {
      console.error(err);
    }
  };

  // Unfollow a user
  const unfollowUser = async (userToUnfollow) => {
    try {
      await fetch('http://localhost:5000/users/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, unfollowUsername: userToUnfollow })
      });
      setFollowing(prev => prev.filter(u => u !== userToUnfollow));
      loadUsers(); // reload to update followers count
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, []);

  return (
  <div className="profile-page">
    <div className="profile-container">
      
      <h2 className="profile-username">{username}</h2>

      <div className="Follower-Count">
        <span><strong>{followersCount}</strong> followers</span>
        <span><strong>{following.length}</strong> following</span>
      </div>

      <button className="feed-btn" onClick={() => navigate('/feed')}>
        Go to Feed
      </button>

      {/* Create Post */}
      <div className="create-post">
        <h3>Create a new post</h3>
        <form onSubmit={createPost}>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            required
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
          />
          <button className="post-btn" type="submit">Post</button>
        </form>
      </div>

      {/* People to follow */}
      <div className="people-section">
        <h3>People you can follow</h3>
        {users.length === 0 ? (
          <p>No other users found.</p>
        ) : (
          users.map(u => (
            <div className="user-row" key={u.username}>
              <span>{u.username}</span>
              {following.includes(u.username) ? (
                <button
                  className="unfollow-btn"
                  onClick={() => unfollowUser(u.username)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="follow-btn"
                  onClick={() => followUser(u.username)}
                >
                  Follow
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="profile-posts">
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map(p => <PostCard key={p.id} post={p} />)
        )}
               <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
      </div>

    </div>
  </div>

  
);

}

export default Profile;
