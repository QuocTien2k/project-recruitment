const router = require("express").Router();
const { getLogged, getUserById } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-logged-user", protect, getLogged);
router.get("/info-user/:id", protect, getUserById);

module.exports = router;
