const router = require("express").Router();
const {
  getActiveUsers,
  getInActiveUsers,
  getActiveTeachers,
  getInActiveTeachers,
  toggleAccountStatus,
  deleteAccount,
  getPendingPost,
  getApprovedPostByAdmin,
  approvePostByAdmin,
  rejectPost,
  deletePostByAdmin,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get(
  "/get-lists-user-active",
  protect,
  authorize("admin"),
  getActiveUsers
);
router.get(
  "/get-lists-user-inactive",
  protect,
  authorize("admin"),
  getInActiveUsers
);
router.get(
  "/get-lists-teacher-active",
  protect,
  authorize("admin"),
  getActiveTeachers
);
router.get(
  "/get-lists-teacher-inactive",
  protect,
  authorize("admin"),
  getInActiveTeachers
);
router.patch(
  "/account-status/:userId",
  protect,
  authorize("admin"),
  toggleAccountStatus
);
router.delete(
  "/delete-account/:userId",
  protect,
  authorize("admin"),
  deleteAccount
);

/***********Route Post*********** */
router.get("/get-pending-post", protect, authorize("admin"), getPendingPost);
router.get(
  "/get-approved-post",
  protect,
  authorize("admin"),
  getApprovedPostByAdmin
);
router.patch(
  "/approve-post/:postId",
  protect,
  authorize("admin"),
  approvePostByAdmin
);
router.patch("/reject-post/:postId", protect, authorize("admin"), rejectPost);
router.delete(
  "/delete-post/:postId",
  protect,
  authorize("admin"),
  deletePostByAdmin
);

module.exports = router;
