const express = require("express");
const {
  getCosts,
  getMonthlyCosts,
  createCost,
  getCost,
  updateCost,
  deleteCost,
} = require("../controllers/costs");

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

const Cost = require("../models/Cost");

const router = express.Router();

router.use(protect);

router.route("/").get(advancedResults(Cost), getCosts).post(createCost);
router.route("/month/:month_number").get(getMonthlyCosts);
router.route("/:id").get(getCost).put(updateCost).delete(deleteCost);

module.exports = router;
