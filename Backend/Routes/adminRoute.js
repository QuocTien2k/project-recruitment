const router = require("express").Router();
const {
  getActiveUsers,
  getInActiveUsers,
  getActiveTeachers,
  getInActiveTeachers,
  toggleAccountStatus,
  deleteAccount,
  getPendingPost,
  getApprovedPost,
  approvePostByAdmin,
  rejectPost,
  deletePostByAdmin,
} = require("../controllers/adminController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.get("/get-lists-user-active", protect, isAdmin, getActiveUsers);
router.get("/get-lists-user-inactive", protect, isAdmin, getInActiveUsers);
router.get("/get-lists-teacher-active", protect, isAdmin, getActiveTeachers);
router.get(
  "/get-lists-teacher-inactive",
  protect,
  isAdmin,
  getInActiveTeachers
);
router.patch("/account-status/:userId", protect, isAdmin, toggleAccountStatus);
router.delete("/delete-account/:userId", protect, isAdmin, deleteAccount);

/***********Route Post*********** */
router.get("/get-pending-post", protect, isAdmin, getPendingPost);
router.get("/get-approved-post", protect, isAdmin, getApprovedPost);
router.patch("/approve-post", protect, isAdmin, approvePostByAdmin);
router.patch("/reject-post", protect, isAdmin, rejectPost);
router.delete("/delete-post/:postId", protect, isAdmin, deletePostByAdmin);

module.exports = router;
