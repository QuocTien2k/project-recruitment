const router = require("express").Router();
const { getDashboard } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", protect, authorize("admin"), getDashboard);
module.exports = router;
