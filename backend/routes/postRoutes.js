const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const postsFile = path.join(__dirname, '../data/posts.json');

// Create a post
router.post('/create', (req, res) => {
    const { username, imageUrl, caption } = req.body;
    if (!username || !imageUrl) 
        return res.status(400).send('Username and image URL are required');

    const posts = JSON.parse(fs.readFileSync(postsFile));
    const newPost = {
        id: Date.now(),       
        username,
        imageUrl,             
        caption,             
        likes: 0,
        likedBy: [],
        createdAt: new Date()
    };

    posts.push(newPost);
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    res.send('Post created successfully');
});


router.get('/', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFile));
    res.json(posts);
});

// Like a post
router.post('/toggle-like', (req, res) => {
    let { postId, username } = req.body;
    postId = parseInt(postId); 

    const posts = JSON.parse(fs.readFileSync(postsFile));
    const post = posts.find(p => p.id === postId);
    if (!post) return res.status(404).send('Post not found');

    if (!post.likedBy) post.likedBy = [];
    post.likes = post.likes || 0;

    if (post.likedBy.includes(username)) {
        post.likes -= 1;
        post.likedBy = post.likedBy.filter(u => u !== username);
        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
        return res.send('Post disliked');
    } else {
        post.likes += 1;
        post.likedBy.push(username);
        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
        return res.send('Post liked');
    }
});



// Delete a post
router.delete('/:postId', (req, res) => {
    const { postId } = req.params;
    const posts = JSON.parse(fs.readFileSync(postsFile));
    const index = posts.findIndex(p => p.id == postId);
    if (index === -1) return res.status(404).send('Post not found');

    posts.splice(index, 1);
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    res.send('Post deleted');
});

module.exports = router;
