const controller = require('../../controller/postsController')

const mockHttp = require('node-mocks-http');

const model = require('../../models/Post');

const mockPosts = [
  {
    "_id": "601d7680e5dcf5148c240437",
    "userId": "601cdc9fa9b299386872ef6b",
    "title": "Test title 1",
    "body": "Test body 1"
  },
  {
    "_id": "601d738384007e3d5428f8f0",
    "userId": "601cdc9fa9b299386872ef6b",
    "title": "Test Title 2",
    "body": "Test body 2"
  },
  {
    "_id": "601d738384007e3d5428f8f0",
    "userId": "601cdc9fa9b299386872ef6b",
    "title": "Test Title 3",
    "body": "Test body 3"
  }
];

// Mocks
model.findById = jest.fn();
model.find = jest.fn();
model.prototype.save = jest.fn();
model.remove = jest.fn();

let req = mockHttp.createRequest();
let res = mockHttp.createResponse();
let next = null;

describe('Post routes -', () => {
  beforeEach(() => {
    req = mockHttp.createRequest();
    res = mockHttp.createResponse();
    next = null;
  });

  afterEach(() => {
    model.findById.mockClear();
    model.find.mockClear();
    model.prototype.save.mockClear();
    model.remove.mockClear();
  });

  describe('getPostById: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.getPostById).toBe('function');
    });

    it('should pass return post by id', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockReturnValue(mockPosts[0]);

      await controller.getPostById(req, res, next);

      expect(model.findById).toHaveBeenCalledWith(req.params.id);
      expect(res._getJSONData()).toStrictEqual(mockPosts[0]);
      expect(res.statusCode).toBe(200);
    });

    it('should pass post not found', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockReturnValue(null);

      await controller.getPostById(req, res, next);

      expect(res.statusCode).toBe(404);
    });

    it('should pass exception handling', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockRejectedValue('Exception');

      await controller.getPostById(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('getAllPosts: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.getAllPosts).toBe('function');
    });

    it('should pass return post by id', async () => {
      model.find.mockReturnValue(mockPosts);

      await controller.getAllPosts(req, res, next);

      expect(model.find).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(mockPosts);
    });

    it('should pass exception handling', async () => {
      model.find.mockRejectedValue('Exception');

      await controller.getPostById(req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res._getData()).toStrictEqual('Server error');
    });
  });

  describe('addPost: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.addPost).toBe('function');
    });

    it('should pass add a post', async () => {
      const newPost = { ...mockPosts[2] }
      req.body = { body: newPost.body, title: newPost.title};

      req.user = { id: newPost.userId };
      model.prototype.save.mockReturnValue(newPost);

      await controller.addPost(req, res, next);
      
      expect(res.statusCode).toBe(201);
      expect(model.prototype.save).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toStrictEqual(newPost);
    });
    
    it('should pass exception handling', async () => {
      model.prototype.save.mockRejectedValue('Exception');

      await controller.getPostById(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('editPost: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.editPost).toBe('function');
    });

    it('should pass update field', async () => {
      const updatedPost = { ...mockPosts[0], title: 'Testing Update'}
      req.params.id = mockPosts[0]._id;
      req.body = { body: updatedPost.body, title: updatedPost.title};

      req.user = { id: mockPosts[0].userId };
      model.findById.mockReturnValue(new model({userId: req.user.id}));
      model.prototype.save.mockReturnValue(updatedPost);

      await controller.editPost(req, res, next);
      expect(res.statusCode).toBe(200);

      expect(model.findById).toHaveBeenCalledTimes(1);
      expect(model.prototype.save).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toStrictEqual(updatedPost);
    });

    it('should pass unauthorized update', async () => {
      const updatedPost = { ...mockPosts[0], title: 'Testing Update'}
      req.params.id = mockPosts[0]._id;
      req.body = { body: updatedPost.body, title: updatedPost.title};

      req.user = { id: 'some other id' };
      model.findById.mockReturnValue(mockPosts[0]);

      await controller.editPost(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(model.findById).toHaveBeenCalledTimes(1);
      expect(model.prototype.save).toHaveBeenCalledTimes(0);
    });

    it('should pass exception handling', async () => {
      model.findById.mockRejectedValue('Exception');

      await controller.getPostById(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('deletePost: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.deletePost).toBe('function');
    });

    it('should pass removing element', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockReturnValue(mockPosts[0]);
      req.user = { id: mockPosts[0].userId };

      model.remove.mockReturnValue('test');
      model.prototype.save.mockReturnValue();

      await controller.deletePost(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(model.remove).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toStrictEqual({ msg: 'Post removed' });
    });

    it('should pass post not found', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockReturnValue();

      await controller.deletePost(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(model.remove).toHaveBeenCalledTimes(0);
      expect(res._getJSONData()).toStrictEqual({ msg: 'Post not found' });
    });

    it('should pass unauthorized update', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockReturnValue(mockPosts[0]);
      req.user = { id: 'Some other id' };

      await controller.deletePost(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(model.remove).toHaveBeenCalledTimes(0);
      expect(res._getJSONData()).toStrictEqual({ msg: 'Not authorized to delete' });
    });

    it('should pass exception handling', async () => {
      req.params.id = mockPosts[0]._id;
      model.findById.mockRejectedValue('Exception');

      await controller.deletePost(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('getPostsByUserId: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.getPostsByUserId).toBe('function');
    });

    it('should pass return posts by Userid', async () => {
      req.params.id = mockPosts[0]._id;
      model.find.mockReturnValue(mockPosts);

      await controller.getPostsByUserId(req, res, next);

      expect(model.find).toHaveBeenCalledWith({ userId: req.params.id});
      expect(res._getJSONData()).toStrictEqual(mockPosts);
      expect(res.statusCode).toBe(200);
    });

    it('should pass exception handling', async () => {
      model.find.mockRejectedValue('Exception');

      await controller.getPostsByUserId(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });
});
