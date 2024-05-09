import { NextFunction, Request, Response } from "express";
import {
  AchievementModel,
  AdminModel,
  PhotoGalleryModel,
  ServiceModel,
  TestimonialModel,
} from "../db/models/adminModels";
import asyncWrapper from "../middleware/async";
import jwt from "jsonwebtoken";
import { BadRequest, NotFoundError, UnauthenticatedError } from "../errors";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

async function signin(req: any, res: Response, next: NextFunction) {
  const { password, email } = req.body;
  if (!password || !email) {
    throw new BadRequest("Email or password is required");
  }
  const admin = await AdminModel.findOne({ email });

  if (!admin) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  // compare password
  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }
  res.status(StatusCodes.OK).json({ admin });
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
const getAllAchivements = asyncWrapper(async (req: Request, res: Response) => {
  const achievement = await AchievementModel.find({});
  res.status(200).json({ achievement });
});
const createAchievment = asyncWrapper(async (req: Request, res: Response) => {
  const achievement = await AchievementModel.create(req.body);
  res.status(201).json({ achievement });
});

const getAchivementById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const achievement = await AchievementModel.findOne({ _id: id });
    if (!achievement) {
      throw new NotFoundError(`no achievement with id ${id} found`);
    }
    res.status(200).json({ achievement });
  }
);

const updateAchievment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
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
    return res
      .status(200)
      .json({ msg: `achivement with id ${id} updated successfully` });
  }
);

const deleteAchievment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

const createService = asyncWrapper(async (req: Request, res: Response) => {
  const service = await ServiceModel.create(req.body);
  res.status(201).json({ service });
});

const getAllServices = asyncWrapper(async (req: Request, res: Response) => {
  const services = await ServiceModel.find({});
  res.status(200).json({ services });
});

const updateServiceById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
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
      .json({ msg: `service with id ${id} updated successfully` });
  }
);

const deleteServiceById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const service = await ServiceModel.findByIdAndDelete(id);
    if (!service) {
      throw new NotFoundError(`no service with id ${id} found`);
      // return next(createCustomError(`no service with id ${id} found`, 404));
    }
    return res
      .status(200)
      .json({ msg: `service with id ${id} deleted successfully` });
  }
);

const getServicesById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const service = await ServiceModel.findOne({ _id: id });
    if (!service) {
      throw new NotFoundError(`no service with id ${id} found`);
      // return next(createCustomError(`no service with id ${id} found`, 404));
    }
    return res.status(200).json({ service });
  }
);

const getAllTestimonies = asyncWrapper(async (req: Request, res: Response) => {
  const testimonials = await TestimonialModel.find({});
  res.status(200).json({ testimonials });
});

const createTestimonial = asyncWrapper(async (req: Request, res: Response) => {
  const testimonial = await TestimonialModel.create(req.body);
  res.status(201).json({ testimonial });
});

const updateTestimonial = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
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

    res
      .status(200)
      .json({ msg: `Testimonial with id ${id} updated successfully` });
  }
);
// Get one testimonial by ID
const getTestimonialById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const testimonial = await TestimonialModel.findById(id);

    if (!testimonial) {
      throw new NotFoundError(`no testimonial with id ${id} found`);
      // return next(createCustomError(`No testimonial with id ${id} found`, 404));
    }

    res.status(200).json({ testimonial });
  }
);

// Delete a testimonial by ID
const deleteTestimonialById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const testimonial = await TestimonialModel.findByIdAndDelete(id);

    if (!testimonial) {
      throw new NotFoundError(`no testimonial with id ${id} found`);
      // return next(createCustomError(`No testimonial with id ${id} found`, 404));
    }

    res
      .status(200)
      .json({ msg: `Testimonial with id ${id} deleted successfully` });
  }
);

// Photo Controllers
const uploadPhoto = asyncWrapper(async (req: Request, res: Response) => {
  // Implement logic to upload a photo and store its details in the database
  // You may want to use a file storage service (like AWS S3) for actual file storage
  // and store the file details (e.g., URL, metadata) in your database.
  res.status(200).json({ msg: "Photo uploaded successfully" });
});

const getAllPhotos = asyncWrapper(async (req: Request, res: Response) => {
  // Implement logic to fetch all photos from the database
  const photos = await PhotoGalleryModel.find({});
  res.status(200).json({ photos });
});

const deletePhoto = asyncWrapper(async (req: Request, res: Response) => {
  // Implement logic to delete a photo from the database
  const { id } = req.params;
  const photo = await PhotoGalleryModel.findByIdAndDelete(id);

  if (!photo) {
    return res.status(404).json({ msg: `No photo with id ${id} found` });
  }

  res.status(200).json({ msg: `Photo with id ${id} deleted` });
});

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
};
