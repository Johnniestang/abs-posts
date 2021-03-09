const controller = require('../../controller/authController')
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
bcrypt.compare = jest.fn();
mockConfig.get = jest.fn();

let req = mockHttp.createRequest();
let res = mockHttp.createResponse();
let next = null;

describe('Auth routes -', () => {
  beforeEach(() => {
    req = mockHttp.createRequest();
    res = mockHttp.createResponse();
    next = null;
    req.body = { email: mockUser.email, password: mockUser.password };
  });

  afterEach(() => {
    model.findById.mockClear();
    model.findOne.mockClear();
    bcrypt.compare.mockClear();
    mockConfig.get.mockClear();
  });

  describe('getAuthUser: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.getAuthUser).toBe('function');
    });

    it('should pass auth user details', async () => {
      req.user = { id: mockUser.userId };
      model.findById.mockReturnValue(mockUser);

      await controller.getAuthUser(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(model.findById).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toStrictEqual(mockUser);

    });

    it('should pass exception handling', async () => {
      model.findById.mockRejectedValue('Exception');

      await controller.getAuthUser(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('setAuthUser: ', () => {
    it('should pass function check', () => {
      expect(typeof controller.setAuthUser).toBe('function');
    });

    it('should pass validate user and return token', async () => {
      model.findOne.mockReturnValue(true);
      bcrypt.compare.mockReturnValue(true);

      mockConfig.get.mockReturnValue('123456789');

      await controller.setAuthUser(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(model.findOne).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toHaveProperty('token');
    });
    
    it('should pass user does not exist', async () => {
      model.findOne.mockReturnValue(false);

      await controller.setAuthUser(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(model.findOne).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toStrictEqual({ errors: [{ msg: 'Invalid credentials' }]} );
    });
        
    it('should pass user password incorrect', async () => {
      model.findOne.mockReturnValue(true);
      bcrypt.compare.mockReturnValue(false);

      await controller.setAuthUser(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(model.findOne).toHaveBeenCalledTimes(1);
      expect(res._getJSONData()).toStrictEqual({ errors: [{ msg: 'Invalid credentials' }]} );
    });
    
    it('should pass exception handling', async () => {
      model.findOne.mockRejectedValue('Exception');

      await controller.getAuthUser(req, res, next);

      expect(res.statusCode).toBe(500);
    });
  });
});
