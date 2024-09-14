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
  updatePhoto,
  sendEmailToUsers,
} from "../controllers/admin";
import { upload } from "../middleware/upload";

const router = express.Router();

router.route("/signin").post(signin);
router.route("/signup").post(signup);
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
router.route("/testimonials").post(createTestimonial);
router.get("/testimonials", getAllTestimonies);
router
  .route("/testimonial/:id")
  .patch(updateTestimonial)
  .delete(deleteTestimonialById)
  .get(getTestimonialById);
router
  .route("/photo")
  .get(getAllPhotos)
  .post(upload.single("image"), uploadPhoto);
router.route("/photo/:id").delete(deletePhoto).patch(updatePhoto);

router.post("/send-email", sendEmailToUsers);

export default router;
