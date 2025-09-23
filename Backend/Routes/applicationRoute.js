const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getApplicationsByPost,
  createApplication,
  approveApplication,
  rejectApplication,
  checkApplicationStatus,
} = require("../controllers/applicationController");

router.get("/post/:postId", protect, authorize("user"), getApplicationsByPost);
router.post("/apply/:postId", protect, authorize("teacher"), createApplication);
router.patch("/approve/:id", protect, authorize("user"), approveApplication);
router.patch("/reject/:id", protect, authorize("user"), rejectApplication);
router.get(
  "/check-status/:postId",
  protect,
  authorize("teacher"),
  checkApplicationStatus
);

module.exports = router;
