const asyncHandler = require("../middleware/async");
const Cost = require("../models/Cost");
const ErrorResponse = require("../utils/errorResponse");

exports.getCosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getMonthlyCosts = asyncHandler(async (req, res, next) => {});

exports.getCost = asyncHandler(async (req, res, next) => {
  const cost = await Cost.findById(req.params.id);
  if (!cost) {
    return next(
      new ErrorResponse(`Cost not found with id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is cost owner
  if (cost.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this cost`,
        401
      )
    );
  }
  res.status(200).json({
    success: true,
    data: cost,
    msg: `Show cost ${req.params.id}`,
  });
});

exports.createCost = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const cost = await Cost.create(req.body);
  res.status(201).json({ success: true, data: cost, msg: `Create new cost` });
});

exports.updateCost = asyncHandler(async (req, res, next) => {
  const cost = await Cost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!cost) {
    return next(
      new ErrorResponse(`Cost not found with id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is cost owner
  if (cost.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this cost`,
        401
      )
    );
  }
  res.status(200).json({
    success: true,
    date: cost,
    msg: `Update cost ${req.params.id}`,
  });
});

exports.deleteCost = asyncHandler(async (req, res, next) => {
  const cost = await Cost.findByIdAndDelete(req.params.id);
  if (!cost) {
    return next(
      new ErrorResponse(`Cost not found with id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is cost owner
  if (cost.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this cost`,
        401
      )
    );
  }
  res.status(200).json({
    success: true,
    data: null,
    msg: `Delete cost ${req.params.id}`,
  });
});
