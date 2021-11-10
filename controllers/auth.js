const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Register user
// @route  POST /api/v1/auth/register
// @access public

exports.register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, password, username, role } = req.body;
  // Create user
  const user = await User.create({
    first_name,
    last_name,
    username,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access public

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new ErrorResponse("Foydalanuvchi nomi va parolni kiriting !", 400)
    );
  }

  // Check for user
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Bu foydalanuvchi mavjud emas !", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Parol xato !", 401));
  }

  sendTokenResponse(user, 200, res);
});


// @desc   Update User Password
// @route  POST /api/v1/auth/updatepassword
// @access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  const isEqual = await user.matchPassword(req.body.currentPassword);

  if (!isEqual) {
    return next(new ErrorResponse("Current Password is incorrect", 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc   Get current user data
// @route  GET /api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
