import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Signup (Create Account)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user - password will be hashed by the model's pre-save hook
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { userId: user._id , role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role, 
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};
