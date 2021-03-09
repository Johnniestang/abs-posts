const joi = require('@hapi/joi');

const Post = require('../models/Post');

const schema = joi.object({
  title: joi.string().required(),
  body: joi.string().required()
});

// Route:  GET api/posts
// Descr:  Returns all posts
// Access: public
exports.getAllPosts = async (req, res, next) => {
  try {
    // const posts = await Post.find().sort({ date: -1});
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Route:  GET api/posts/:id
// Descr:  Returns a post by id
// Access: public
exports.getPostById = async (req, res, next) => {
  try {
    // const posts = await Post.find().sort({ date: -1});
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Route:  GET api/posts/user/:id
// Descr:  Returns list of posts by userid
// Access: public
exports.getPostsByUserId = async (req, res, next) => {
  try {
    const post = await Post.find({ userId: req.params.id });
    if (!post) {
      return res.status(404).json({ msg: 'Posts not found' });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Posts not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Route:  POST api/posts
// Descr:  Add a posts
// Access: private
exports.addPost = async (req, res, next) => {
  const isValid = await schema.validate(req.body);
  if (isValid.error) {
    return res.status(400).json(isValid.error.details);
  }

  const { title, body } = req.body;

  try {
    const newPost = new Post({
      userId: req.user.id,
      title,
      body
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Route:  PUT api/posts/:id
// Descr:  Update a post by id
// Access: private
exports.editPost = async (req, res, next) => {
  const isValid = await schema.validate(req.body);
  if (isValid.error) {
    return res.status(400).json(isValid.error.details);
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (req.user.id !== post.userId.toString()) {
      return res.status(401).json({ msg: 'Not authorized to update' });
    }

    const { title, body } = req.body;
    post.title = title;
    post.body = body;
    post.date = Date.now();

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Route:  DELETE api/posts/:id
// Descr:  Delete a post on id
// Access: private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (req.user.id !== post.userId.toString()) {
      return res.status(401).json({ msg: 'Not authorized to delete' });
    }

    await Post.remove(post);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
