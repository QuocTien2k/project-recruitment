const router = require("express").Router();
const {
  getAllUsers,
  getAllTeachers,
} = require("../controllers/adminController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.get("/get-lists-user", protect, isAdmin, getAllUsers);
router.get("/get-lists-teacher", protect, isAdmin, getAllTeachers);

module.exports = router;
