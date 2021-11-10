const express = require("express");
const {
  register,
  login,
  getMe,
  updatePassword,
} = require("../controllers/auth");

router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
