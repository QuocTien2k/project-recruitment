const router = require("express").Router();
const { getAllUsers } = require("../controllers/adminController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.get("/lists-user", protect, isAdmin, getAllUsers);

module.exports = router;
