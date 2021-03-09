const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const joi = require('@hapi/joi');

const User = require('../models/User');

const schema = joi.object({
  name: joi.string().required(),
  password: joi.string().required().min(6),
  email: joi.string().email().required(),
  expertise: joi.string().required()
});

// Route: POST api/users
// Descr: Registers a user
// router.post('/',
exports.createUser = async (req, res, next) => {
  const isValid = await schema.validate(req.body);
  if (isValid.error) {
    return res.status(400).json(isValid.error.details);
  }

  const { name, email, expertise, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const salt = await bcrypt.genSalt(10);
    user = new User({
      name,
      email,
      expertise,
      password: await bcrypt.hash(password, salt)
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = await jwt.sign(payload,
      config.get('token.jwtSecret'),
      { expiresIn: config.get('token.expires') });

    res.status(201).json({ token })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
