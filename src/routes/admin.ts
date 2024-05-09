import express from "express";
import {
  createAchievment,
  createService,
  createTestimonial,
  deleteAchievment,
  deletePhoto,
  deleteServiceById,
  getAchivementById,
  getAllAchivements,
  getAllPhotos,
  getAllServices,
  getAllTestimonies,
  getServicesById,
  signin,
  signup,
  updateAchievment,
  updateServiceById,
  updateTestimonial,
  uploadPhoto,
  deleteTestimonialById,
  getTestimonialById,
} from "../controllers/admin";
import authMiddleware from "../middleware/authenticationMiddleware";

const router = express.Router();

router.route("/signin").post(authMiddleware, signin);
// router.route("/signin").post(signin);
router.route("/signup").post(signup);
// router.route("/add-admin").post()
router.route("/services").get(getAllServices).post(createService);
router
  .route("/service/:id")
  .delete(deleteServiceById)
  .patch(updateServiceById)
  .get(getServicesById);
router.route("/achievements").get(getAllAchivements).post(createAchievment);
router
  .route("/achievement/:id")
  .patch(updateAchievment)
  .delete(deleteAchievment)
  .get(getAchivementById);
router.route("/testimonials").get(getAllTestimonies).post(createTestimonial);
router
  .route("/testimonial/:id")
  .patch(updateTestimonial)
  .delete(deleteTestimonialById)
  .get(getTestimonialById);
router.route("/photo").get(getAllPhotos).post(uploadPhoto);
router.route("/photo/:id").delete(deletePhoto);

export default router;
