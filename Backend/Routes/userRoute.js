const router = require("express").Router();
const {
  getLogged,
  getPublicTeachers,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-logged-user", protect, getLogged);
router.get("/get-lists-teacher", getPublicTeachers);

module.exports = router;
