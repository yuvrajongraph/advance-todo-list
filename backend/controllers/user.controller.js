const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const User = require("../models/user.model");
const fs = require("fs");
const uploadImageCloudinary = require("../utils/uploadImageCloudinary");

const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file;

  const link = await uploadImageCloudinary(
    __dirname + `/../uploads/${req.file.filename}`
  );
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { url: link } },
    { new: true }
  );

  return commonErrorHandler(
    req,
    res,
    { data: { imageLink: link }, quote: " Profile Image updated successfully" },
    200
  );
});

const getSingleUser = asyncHandler(async (req, res) => {
  const userData = await User.findOne({ _id: req.user._id });

  return commonErrorHandler(req, res, {data:userData, quote:"User found"}, 200);
});

module.exports = { uploadImage, getSingleUser };
