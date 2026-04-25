const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../../database/models');

const {
  registerSchema,
  loginSchema,
  changePasswordSchema
} = require('../../../validations/authValidation');

const generateToken = ({ id, role }) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Register
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { email, password } = value;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      ...value,
      password: await bcrypt.hash(password, 10)
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { email, password } = value;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { currentPassword, newPassword } = value;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password changed successfully' });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Profile
const getProfile = async (req, res) => {
  return res.json(req.user);
};

module.exports = {
  register,
  login,
  changePassword,
  getProfile
};
