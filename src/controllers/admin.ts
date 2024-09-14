import { NextFunction, Request, Response } from "express";
import {
  AchievementModel,
  AdminModel,
  NewsletterSubscriberModel,
  PhotoGalleryModel,
  ServiceModel,
  TestimonialModel,
} from "../db/models/adminModels";
// import asyncWrapper from "../middleware/async";
// import jwt from "jsonwebtoken";
import { BadRequest, NotFoundError, UnauthenticatedError } from "../errors";
import { StatusCodes } from "http-status-codes";
// import bcrypt from "bcryptjs";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary,
} from "../middleware/upload";
import { sendUserWelcomeEmail } from "../mailtrap/email";

async function signin(req: any, res: Response, next: NextFunction) {
  const { password, email } = req.body;
  if (!password || !email) {
    throw new BadRequest("Email or password is required");
  }
  const admin = await AdminModel.findOne({ email });

  if (!admin) {
    throw new UnauthenticatedError("Invalid credentials, user not found");
  }
  // compare password
  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }
  const token = admin.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ msg: "User logged in successfully", token });
}

async function signup(req: Request, res: Response, next: NextFunction) {
  const admin = await AdminModel.create({ ...req.body });
  const token = admin.createJWT();
  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully",
    user: { name: admin.getName() },
    token,
  });
}
const getAllAchivements = async (req: Request, res: Response) => {
  const achievement = await AchievementModel.find({});
  res.status(200).json({ achievement, count: achievement.length });
};
const createAchievment = async (req: Request, res: Response) => {
  const achievement = await AchievementModel.create(req.body);
  res.status(201).json({ achievement });
};

const getAchivementById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const achievement = await AchievementModel.findOne({ _id: id });
  if (!achievement) {
    throw new NotFoundError(`no achievement with id ${id} found`);
  }
  res.status(200).json({ achievement });
};

const updateAchievment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const achievement = await AchievementModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!achievement) {
    throw new NotFoundError(`no achievement with id ${id} found`);
    // return next(createCustomError(`no achievement with id ${id} found`, 404));
  }
  return res.status(200).json({
    msg: `achivement with id ${id} updated successfully`,
    achievement,
  });
};

const deleteAchievment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const achievement = await AchievementModel.findByIdAndDelete(req.params.id);
  if (!achievement) {
    throw new NotFoundError(`no achievement with id ${req.params.id} found`);
    // return next(
    //   createCustomError(`no achievement with id ${req.params.id} found`, 404)
    // );
  }
  return res
    .status(200)
    .json({ msg: `achivement with id ${req.params.id} deleted` });
};

const createService = async (req: Request, res: Response) => {
  const service = await ServiceModel.create(req.body);
  res.status(201).json({ service });
};

const getAllServices = async (req: Request, res: Response) => {
  const services = await ServiceModel.find({});
  res.status(200).json({ services, count: services.length });
};

const updateServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const service = await ServiceModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    throw new NotFoundError(`no service with id ${id} found`);
    // return next(createCustomError(`no service with id ${id} found`, 404));
  }
  return res
    .status(200)
    .json({ msg: `service with id ${id} updated successfully`, service });
};

const deleteServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const service = await ServiceModel.findByIdAndDelete(id);
  if (!service) {
    throw new NotFoundError(`no service with id ${id} found`);
    // return next(createCustomError(`no service with id ${id} found`, 404));
  }
  return res
    .status(200)
    .json({ msg: `service with id ${id} deleted successfully` });
};

const getServicesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const service = await ServiceModel.findOne({ _id: id });
  if (!service) {
    throw new NotFoundError(`no service with id ${id} found`);
    // return next(createCustomError(`no service with id ${id} found`, 404));
  }
  return res.status(200).json({ service });
};

const getAllTestimonies = async (req: Request, res: Response) => {
  const testimonials = await TestimonialModel.find({});
  res.status(200).json({ testimonials, counts: testimonials.length });
};

const createTestimonial = async (req: Request, res: Response) => {
  const testimonial = await TestimonialModel.create(req.body);
  res.status(201).json({ testimonial });
};

const updateTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const testimonial = await TestimonialModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    throw new NotFoundError(`no testimonial with id ${id} found`);
    // return next(createCustomError(`No testimonial with id ${id} found`, 404));
  }

  res.status(200).json({
    msg: `Testimonial with id ${id} updated successfully`,
    testimonial,
  });
};
// Get one testimonial by ID
const getTestimonialById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const testimonial = await TestimonialModel.findById(id);

  if (!testimonial) {
    throw new NotFoundError(`no testimonial with id ${id} found`);
    // return next(createCustomError(`No testimonial with id ${id} found`, 404));
  }

  res.status(200).json({ testimonial });
};

// Delete a testimonial by ID
const deleteTestimonialById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const testimonial = await TestimonialModel.findByIdAndDelete(id);

  if (!testimonial) {
    throw new NotFoundError(`no testimonial with id ${id} found`);
    // return next(createCustomError(`No testimonial with id ${id} found`, 404));
  }

  res
    .status(200)
    .json({ msg: `Testimonial with id ${id} deleted successfully` });
};

// Photo Controllers
const uploadPhoto = async (req: Request, res: Response) => {
  const image = req.file;
  const { type } = req.body;
  if (!image) {
    throw new BadRequest("Please upload an image with it's type");
  }
  const imgUrl = await uploadToCloudinary(image);
  const photo = await PhotoGalleryModel.create({
    imageUrl: imgUrl,
    type,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Photo uploaded successfully", photo });
};

const getAllPhotos = async (req: Request, res: Response) => {
  // Implement logic to fetch all photos from the database
  const photos = await PhotoGalleryModel.find({});
  res.status(200).json({ counts: photos.length, photos });
};

const deletePhoto = async (req: Request, res: Response) => {
  // Implement logic to delete a photo from the database
  const { id } = req.params;
  const photo = await PhotoGalleryModel.findByIdAndDelete(id);

  if (!photo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No photo with id ${id} found` });
  }

  photo.imageUrl && (await deleteFileFromCloudinary(photo.imageUrl));

  res.status(StatusCodes.OK).json({ msg: `Photo with id ${id} deleted` });
};

const updatePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newPhoto = req.file;
  const { type } = req.body;
  console.log(type);
  if (!newPhoto) {
    throw new BadRequest("Please upload an image");
  }

  const photoToUpdate = await PhotoGalleryModel.findById(id);

  if (!photoToUpdate) {
    throw new NotFoundError(`photo with id ${id} not found`);
  }

  photoToUpdate.imageUrl &&
    (await deleteFileFromCloudinary(photoToUpdate.imageUrl));

  const imgUrl = await uploadToCloudinary(newPhoto);
  const photo = await PhotoGalleryModel.findByIdAndUpdate(id, type, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ msg: "Photo update succesfully", photo });
};

export async function sendEmailToUsers(req: Request, res: Response) {
  const { emailID, usersId } = req.body;

  const usersEmail = await NewsletterSubscriberModel.find({
    _id: { $in: usersId },
  });

  usersEmail.forEach(async (user) => {
    await sendUserWelcomeEmail(user.email);
  });

  return res.status(StatusCodes.OK).json({ msg: "Emails send successfully" });
}

export {
  createAchievment,
  createTestimonial,
  deleteAchievment,
  updateAchievment,
  getAllAchivements,
  createService,
  deletePhoto,
  getAllPhotos,
  getAllServices,
  getAllTestimonies,
  signin,
  signup,
  updateTestimonial,
  uploadPhoto,
  getAchivementById,
  getServicesById,
  updateServiceById,
  deleteServiceById,
  getTestimonialById,
  deleteTestimonialById,
  updatePhoto,
};
