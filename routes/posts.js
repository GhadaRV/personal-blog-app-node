const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const { marked } = require('marked');
const router = express.Router();

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    try {
        const contentHtml = marked(content);

        const newPost = new Post({
            title,
            content,
            contentHtml,
            author: req.user.id
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Fetch all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email');
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Fetch a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username email');
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Edit a post
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const contentHtml = marked(content);

        post.title = title || post.title;
        post.content = content || post.content;
        post.contentHtml = contentHtml || post.contentHtml;
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
