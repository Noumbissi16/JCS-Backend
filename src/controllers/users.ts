import { Request, Response } from "express";
import {
  AchievementModel,
  ServiceModel,
  TestimonialModel,
} from "../db/models/adminModels";
import { StatusCodes } from "http-status-codes";

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

async function subscribeNewsletter(req: Request, res: Response) {}

async function getAllTestimonies(req: Request, res: Response) {
  const testimonials = TestimonialModel.find();
  res.status(StatusCodes.OK).json({
    testimonials,
  });
}

async function getAllPhotos(req: Request, res: Response) {
  res.send("All photos");
}

export {
  getAllAchivements,
  getAllServices,
  subscribeNewsletter,
  getAllPhotos,
  getAllTestimonies,
};
