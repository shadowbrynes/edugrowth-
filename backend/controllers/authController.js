const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, Student, Teacher, Parent, PasswordResetToken } = require('../models');

// Helper to generate JWT token
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'excelmind_super_secret_jwt_key_2025_academic_companion';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: `${user.first_name} ${user.last_name}`
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

// 1. User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
      include: [
        { model: Student, as: 'student_profile', required: false },
        { model: Teacher, as: 'teacher_profile', required: false },
        { model: Parent, as: 'parent_profile', required: false }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.first_name}!`,
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_image: user.profile_image,
        student_profile: user.student_profile,
        teacher_profile: user.teacher_profile,
        parent_profile: user.parent_profile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// 2. User Registration
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase().trim(),
      phone,
      password_hash: password,
      role: role || 'Student'
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered',
      token,
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// 3. Forgot Password Request
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      // Return 200 for security so email enumeration is mitigated
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been dispatched.'
      });
    }

    // Generate token valid for 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    const expiry_time = new Date(Date.now() + 3600000); // 1 hour

    await PasswordResetToken.create({
      user_id: user.id,
      token,
      expiry_time
    });

    // In production, send email with reset link. In dev, return token.
    return res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully. Valid for 60 minutes.',
      reset_token: token,
      reset_link: `http://localhost:3000/reset-password?token=${token}`
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4. Reset Password with Token
exports.resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;
    if (!token || !new_password) {
      return res.status(400).json({ success: false, message: 'Token and new password required' });
    }

    const resetRecord = await PasswordResetToken.findOne({
      where: { token }
    });

    if (!resetRecord || new Date() > new Date(resetRecord.expiry_time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    const user = await User.findByPk(resetRecord.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password_hash = new_password;
    await user.save();

    // Delete used token
    await resetRecord.destroy();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new credentials.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5. Current Authenticated Profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Student, as: 'student_profile', required: false },
        { model: Teacher, as: 'teacher_profile', required: false },
        { model: Parent, as: 'parent_profile', required: false }
      ]
    });

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
