const router = require("express").Router();
const {
  createEmptyContract,
  createContractWithPost,
  createContractWithPostAndRecipient,
  downloadContract,
} = require("../controllers/contractController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/create-empty", protect, authorize("user"), createEmptyContract);
router.post(
  "/create-with-post",
  protect,
  authorize("user"),
  createContractWithPost
);
router.post(
  "/create-full",
  protect,
  authorize("user"),
  createContractWithPostAndRecipient
);
router.get(
  "/download/:contractId",
  protect,
  authorize("user"),
  downloadContract
);

module.exports = router;
