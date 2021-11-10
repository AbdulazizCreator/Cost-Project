const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Get all users
// @route  GET /api/v1/auth/users
// @access Private

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get single user
// @route  GET /api/v1/auth/users/:id
// @access Private

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

// @desc   Create user
// @route  POST /api/v1/auth/users
// @access Private/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
  let new_user = await User.create(req.body);
  res.status(201).json({ success: true, data: new_user });
});

// @desc   Update user
// @route  PUT /api/v1/auth/users/:id
// @access Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.password) {
    return next(new ErrorResponse(`Password can't be changed`, 401));
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc   Delete user
// @route  DELETE /api/v1/auth/users/:id
// @access Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
