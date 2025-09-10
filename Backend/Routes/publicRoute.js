const router = require("express").Router();
const {
  getAllApprovedPosts,
  getApproveShortList,
  getDetailPost,
  getPostBySlug,
  getTeachersShortList,
  getListTeachers,
  getListTeacherNatural,
  getListTeacherSocial,
  getListTeacherLanguages,
  getPublicTeacherDetail,
  countViews,
} = require("../controllers/publicController.js");

router.get("/list-posts", getAllApprovedPosts);
router.get("/get-post-short", getApproveShortList);
router.get("/detail-post/:postId", getDetailPost);
router.get("/detail-by-slug/:slug", getPostBySlug);
router.get("/get-teacher-short-list", getTeachersShortList);
router.get("/get-list-teachers", getListTeachers);
router.get("/teachers-natural", getListTeacherNatural);
router.get("/teachers-social", getListTeacherSocial);
router.get("/teachers-languages", getListTeacherLanguages);
router.get("/teachers/:teacherId", getPublicTeacherDetail);
router.get("/count-view/:postId", countViews);

module.exports = router;
