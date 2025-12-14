const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFile = path.join(__dirname, '../data/users.json');

// Signup route
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(usersFile));

    // Check if user already exists
    if(users.find(u => u.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password, following: [], followers: [] });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.send('Signup successful');
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile));

    const user = users.find(u => u.username === username && u.password === password);
    if(user) {
        res.send('Login successful');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// follow a user
router.post('/follow', (req, res) => {
    const { username, followUsername } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile));

    const currentUser = users.find(u => u.username === username);
    if (!currentUser) return res.status(400).send('User not found');

    const followedUser = users.find(u => u.username === followUsername);
    if (!followedUser) return res.status(400).send('User to follow not found');

    if (!currentUser.following.includes(followUsername)) {
        currentUser.following.push(followUsername);
    }
    if (!followedUser.followers) followedUser.followers = [];
    if (!followedUser.followers.includes(username)) {
        followedUser.followers.push(username);
    }

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.send('User followed successfully');
});

// Unfollow a user
router.post('/unfollow', (req, res) => {
    const { username, unfollowUsername } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile));

    const currentUser = users.find(u => u.username === username);
    if (!currentUser) return res.status(400).send('User not found');

    const unfollowedUser = users.find(u => u.username === unfollowUsername);
    if (!unfollowedUser) return res.status(400).send('User to unfollow not found');

    currentUser.following = currentUser.following.filter(u => u !== unfollowUsername);
    if (unfollowedUser.followers) {
        unfollowedUser.followers = unfollowedUser.followers.filter(u => u !== username);
    }

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.send('User unfollowed successfully');
});

router.get('/', (req, res) => {
    const users = JSON.parse(fs.readFileSync(usersFile));

    const safeUsers = users.map(u => ({
        username: u.username,
        following: u.following || []
    }));

    res.json(safeUsers);
});


module.exports = router;
