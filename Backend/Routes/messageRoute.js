const router = require("express").Router();
const { createNewMessage } = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/new-message", protect, createNewMessage);

module.exports = router;
