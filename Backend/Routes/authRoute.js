const router = require("express").Router();
const { signupUser } = require("../controllers/authController");

router.post("/signup-user", signupUser);

module.exports = router;
