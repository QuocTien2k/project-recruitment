const router = require("express").Router();
const { getLogged } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-logged-user", protect, getLogged);

module.exports = router;
