const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const commentsFile = path.join(__dirname, '../data/comments.json');
const postsFile = path.join(__dirname, '../data/posts.json');


router.post('/add', (req, res) => {
    const { postId, username, comment } = req.body;

    if (!postId || !username || !comment) {
        return res.status(400).send('postId, username, and comment are required');
    }

    // Check if post exists
    const posts = JSON.parse(fs.readFileSync(postsFile));
    if (!posts.find(p => p.id === postId)) {
        return res.status(400).send('Post not found');
    }

    const comments = JSON.parse(fs.readFileSync(commentsFile));
    const newComment = { id: comments.length + 1, postId, username, comment, createdAt: new Date() };

    comments.push(newComment);
    fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

    res.send('Comment added successfully');
});


router.get('/:postId', (req, res) => {
    const postId = parseInt(req.params.postId);
    const comments = JSON.parse(fs.readFileSync(commentsFile));

    const postComments = comments.filter(c => c.postId === postId);
    res.json(postComments);
});

module.exports = router;
