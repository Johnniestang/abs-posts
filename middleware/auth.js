const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('token.jwtSecret');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Missing token' });
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
