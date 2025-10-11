const router = require("express").Router();
const {
  getListReport,
  createReport,
  handleReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const uploadSingleToCloud = require("../utils/uploadSingleToCloud");
const upload = require("../middlewares/multer");

router.get("/lists", protect, authorize("admin", "user"), getListReport);
router.post(
  "/create",
  protect,
  authorize("user", "teacher"),
  upload.single("reportPic"),
  uploadSingleToCloud,
  createReport
);

router.put("/handle/:reportId", protect, authorize("admin"), handleReport);

module.exports = router;
