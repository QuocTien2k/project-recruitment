const router = require("express").Router();
const { getDetailPost } = reuqire("../controllers/publicController.js");

router.get("/detail-post", getDetailPost);

module.exports = router;
