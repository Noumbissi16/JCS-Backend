import { Request, Response } from "express";
import {
  AchievementModel,
  NewsletterSubscriberModel,
  PhotoGalleryModel,
  ServiceModel,
  TestimonialModel,
} from "../db/models/adminModels";
import { StatusCodes } from "http-status-codes";
import { sendUserWelcomeEmail } from "../mailtrap/email";
import { BadRequest } from "../errors";
import isValidEmail from "../utils/isValidEmail";

const getAllAchivements = async (req: Request, res: Response) => {
  const achievements = await AchievementModel.find();
  res.status(StatusCodes.OK).json({
    achievements,
  });
};

const getAllServices = async (req: Request, res: Response) => {
  const services = await ServiceModel.find();
  res.status(StatusCodes.OK).json({
    services,
  });
};

async function subscribeNewsletter(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("Provide email you want to subscribe with");
  }
  const isValidEmailAddresse = isValidEmail(email);
  if (!isValidEmailAddresse) {
    throw new BadRequest(
      "Invalid email format! Provide a correct email please!"
    );
  }
  await sendUserWelcomeEmail(email);
  await NewsletterSubscriberModel.create({ email });
  return res.status(StatusCodes.OK).json({ msg: "Email send successfully" });
}

async function getAllTestimonies(req: Request, res: Response) {
  const testimonials = await TestimonialModel.find();
  res.status(StatusCodes.OK).json({
    testimonials,
  });
}

async function getAllPhotos(req: Request, res: Response) {
  const photos = await PhotoGalleryModel.find();
  res.status(StatusCodes.OK).json(photos);
}

export {
  getAllAchivements,
  getAllServices,
  subscribeNewsletter,
  getAllPhotos,
  getAllTestimonies,
};
