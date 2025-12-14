import React, { useState, useEffect } from 'react';
import './postcard.css'; 

function PostCard({ post, onLike, onDelete }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const username = localStorage.getItem('username');

  const loadComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/comments/${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments');
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment || !username) return;
    try {
      await fetch('http://localhost:5000/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, username, comment: newComment }),
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment');
    }
  };

  const handleLike = () => onLike && onLike(post.id);
  const handleDelete = () => onDelete && onDelete(post.id);

  return (
    <div className="post-card">
      <strong>{post.username}</strong>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" />
      )}

      {post.caption && <p className="post-caption">{post.caption}</p>}

      <small className="post-timestamp">{new Date(post.createdAt).toLocaleString()}</small>

      <div className="post-actions">
        <button onClick={handleLike}>
          {post.likedBy && post.likedBy.includes(username) ? 'Unlike' : 'Like'} ({post.likes || 0})
        </button>
        {post.username === username && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>

      <div className="comment-section">
        <strong>Comments:</strong>
        {comments.map((c, index) => (
          <div key={index} className="comment">
            <strong>{c.username}</strong>: {c.comment}
          </div>
        ))}
        <input
          type="text"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
    </div>
  );
}

export default PostCard;
