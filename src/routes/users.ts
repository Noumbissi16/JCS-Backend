import express from "express";
import {
  getAllAchivements,
  getAllPhotos,
  getAllServices,
  getAllTestimonies,
  subscribeNewsletter,
} from "../controllers/users";

const router = express.Router();

router.route("/services").get(getAllServices);
router.route("/achievements").get(getAllAchivements);
router.route("/subscribe-newsletter").post(subscribeNewsletter);
router.route("/testimonials").get(getAllTestimonies);
router.route("/photos").get(getAllPhotos);

export default router;
// module.exports = router;
