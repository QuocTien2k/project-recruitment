const router = require("express").Router();
const {
  getActiveUsers,
  getAllTeachers,
} = require("../controllers/adminController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.get("/get-lists-user-active", protect, isAdmin, getActiveUsers);
router.get("/get-lists-teacher-active", protect, isAdmin, getAllTeachers);

module.exports = router;
