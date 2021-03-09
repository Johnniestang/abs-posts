const router = require('express').Router();
const userController = require('../controller/usersController');
const authController = require('../controller/authController');
const postController = require('../controller/postsController');
const auth = require('../middleware/auth');

router.post('/users', userController.createUser);
router.post('/auth', authController.setAuthUser);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.get('/posts/user/:id', postController.getPostsByUserId);

// Protected routes
router.get('/auth', auth, authController.getAuthUser);
router.post('/posts', auth, postController.addPost);
router.put('/posts/:id', auth, postController.editPost);
router.delete('/posts/:id', auth, postController.deletePost);

module.exports = router;
