const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const joi = require('@hapi/joi');

const schema = joi.object({
  email: joi.string().required(),
  password: joi.string().required()
});

// Route: GET api/auth
// Descr: Returns an authenicated user
exports.getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Route:  POST api/auth
// Descr:  Validate user and return token
// Access: Public
exports.setAuthUser = async (req, res, next) => {
  const isValid = await schema.validate(req.body);
  if (isValid.error) {
    return res.status(400).json(isValid.error.details);
  } 

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Create and return new token
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload,
      config.get('token.jwtSecret'),
      { expiresIn: config.get('token.expires') });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
