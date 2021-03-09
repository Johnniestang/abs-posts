const controller = require('../../controller/usersController')
const bcrypt = require('bcryptjs');
const model = require('../../models/User');

const mockConfig = require('config');
const mockHttp = require('node-mocks-http');

const mockUser = {
  "name": "Test name",
  "email": "tester@testing.com",
  "expertise": "testing",
  "password": "12345678"
};

// Mocks
model.findById = jest.fn();
model.findOne = jest.fn();
model.prototype.save = jest.fn();
bcrypt.hash = jest.fn();
bcrypt.genSalt = jest.fn();
mockConfig.get = jest.fn();

let req = mockHttp.createRequest();
let res = mockHttp.createResponse();
let next = null;

describe('User routes -', () => {
  beforeEach(() => {
    req = mockHttp.createRequest();
    res = mockHttp.createResponse();
    next = null;
    req.body = { ...mockUser };
  });

  afterEach(() => {
    model.findById.mockClear();
    model.findOne.mockClear();
    model.prototype.save.mockClear();
    bcrypt.hash.mockClear();
    bcrypt.genSalt.mockClear();
    mockConfig.get.mockClear();
  });

  describe('createUser: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.createUser).toBe('function');
    });

    it('should pass create a user', async done => {
      model.findOne.mockReturnValue(false);
      bcrypt.hash.mockReturnValue('some hash string');
      bcrypt.genSalt.mockReturnValue(10);
      mockConfig.get.mockReturnValue('123456789');

      await controller.createUser(req, res, next);

      expect(res.statusCode).toBe(201);
      expect(model.prototype.save).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toHaveProperty('token');
      done();
    });

    it('should pass when user exists', async done => {
      model.findOne.mockReturnValue(true);

      await controller.createUser(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(model.prototype.save).toHaveBeenCalledTimes(0);
      expect(res._getJSONData()).toStrictEqual({ errors: [{ msg: 'User already exists' }] });
      done();
    });

    it('should pass exception handling', async () => {
      model.findOne.mockReturnValue(false);
      model.prototype.save.mockRejectedValue('Exception');

      await controller.createUser(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });
});
