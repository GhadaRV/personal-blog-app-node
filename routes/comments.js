const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth'); // Ensure you have auth middleware
const router = express.Router();

// Add a comment to a post
router.post('/', authMiddleware, async (req, res) => {
    const { post, content } = req.body;

    try {
        const newComment = new Comment({
            post,
            content,
            author: req.user.id
        });
        await newComment.save();

        // Add the comment to the post's comments array
        const postUpdated = await Post.findById(post);
        if (!postUpdated) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        postUpdated.comments.push(newComment._id);
        await postUpdated.save();

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Fetch comments for a post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username email');
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a comment
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if the user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Remove comment from the post's comments array
        const post = await Post.findById(comment.post);
        if (post) {
            post.comments = post.comments.filter(commentId => commentId.toString() !== comment._id.toString());
            await post.save();
        }

        await comment.remove();
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
