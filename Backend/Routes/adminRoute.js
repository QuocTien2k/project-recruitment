const router = require("express").Router();
const {
  getActiveUsers,
  getInActiveUsers,
  getActiveTeachers,
  getInActiveTeachers,
  toggleAccountStatus,
  deleteAccount,
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
router.delete("/delete-post/:postId", protect, isAdmin, deletePostByAdmin);

module.exports = router;
