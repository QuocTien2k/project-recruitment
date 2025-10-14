const router = require("express").Router();
const {
  getResolvedReports,
  getPendingReports,
  handleReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/pending", protect, authorize("admin"), getPendingReports);
router.get("/resolved", protect, authorize("admin"), getResolvedReports);
router.put("/handle/:reportId", protect, authorize("admin"), handleReport);

module.exports = router;
