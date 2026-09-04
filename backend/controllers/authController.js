const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, Student, Teacher, Parent, PasswordResetToken, LoginActivity, AuditLog } = require('../models');

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

    // Save Login Activity in MySQL login_activity table
    const userAgent = req.headers['user-agent'] || 'Web Client';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    let loginRecord = null;
    try {
      loginRecord = await LoginActivity.create({
        user_id: user.id,
        device: String(userAgent).slice(0, 250),
        ip_address: String(ip).slice(0, 45),
        login_time: new Date()
      });

      await AuditLog.create({
        user_id: user.id,
        action: 'USER_LOGIN',
        description: `User ${user.email} (${user.role}) logged in successfully.`,
        ip_address: String(ip).slice(0, 45)
      });
    } catch (logErr) {
      console.warn('[Auth Log Warning]:', logErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.first_name}!`,
      token,
      login_id: loginRecord ? loginRecord.id : null,
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

// 2. User Logout
exports.logout = async (req, res) => {
  try {
    const { login_id, user_id } = req.body;
    if (login_id) {
      await LoginActivity.update({ logout_time: new Date() }, { where: { id: login_id } });
    } else if (user_id) {
      const latest = await LoginActivity.findOne({ where: { user_id }, order: [['id', 'DESC']] });
      if (latest) {
        latest.logout_time = new Date();
        await latest.save();
      }
    }

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

// 3. User Login History
exports.getLoginHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const history = await LoginActivity.findAll({
      where: { user_id },
      order: [['login_time', 'DESC']],
      limit: 30
    });
    return res.status(200).json({ success: true, count: history.length, history });
  } catch (err) {
    console.error('getLoginHistory error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4. User Registration
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
      role: role || 'student'
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

// 5. Forgot Password Request
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been dispatched.'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry_time = new Date(Date.now() + 3600000); // 1 hour

    await PasswordResetToken.create({
      user_id: user.id,
      token,
      expiry_time
    });

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

// 6. Reset Password with Token
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

// 7. Current Authenticated Profile
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
