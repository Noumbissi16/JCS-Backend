import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const achievementsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Must provide a title"],
      trim: true,
      maxlength: [20, "Title cannot be more than 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Must provide a description"],
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    services: {
      type: mongoose.Types.ObjectId,
      ref: "services",
      required: [
        true,
        "Please precise the service to whom this achievement belongs",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const servicesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Must provide a title"],
      trim: true,
      maxlength: [50, "Title cannot be more than 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Must provide a description"],
    },
  },
  {
    timestamps: true,
  }
);
// Schema for Newsletter Subscribers
const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Must provide an email address"],
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
});

// Schema for Customers Partners
const customersPartnersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
    trim: true,
  },
  logo: {
    type: String,
    required: [true, "Must provide a logo link"],
  },
  description: {
    type: String,
    trim: true,
  },
});

// Schema for Testimonials
const testimonialsSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "Must provide the author's name"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Must provide the testimonial text"],
      trim: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Schema for FAQ
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Must provide a question"],
    trim: true,
  },
  answer: [
    {
      type: String,
      trim: true,
    },
  ],
});

// Schema for Team
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
    trim: true,
  },
  position: {
    type: String,
    required: [true, "Must provide a position"],
    trim: true,
  },
  photo: {
    type: String,
  },
});

// Schema for Photo Gallery
const photoGallerySchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Must provide a gallery type"],
    trim: true,
  },
  images: [
    {
      type: String, // Assuming a URL for each image, adjust as needed
    },
  ],
});

// Schema for News
const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Must provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Must provide a description"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Schema for Admin

interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  privilege: string;
  getName(): string;
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const adminSchema = new mongoose.Schema<IAdmin>({
  name: {
    type: String,
    required: [true, "Must provide a name"],
    trim: true,
    minlength: [3, "Name should be at least 3 characters long"],
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  privilege: {
    type: String,
    enum: ["All", "Middle", "Basic"],
    default: "Basic",
  },
  email: {
    type: String,
    required: [true, "Must provide an email address"],
    trim: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Must provide a password"],
    trim: true,
  },
  profileImage: {
    type: String,
  },
});

adminSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

adminSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_LIFETIME!,
    }
  );
};

adminSchema.methods.getName = function () {
  return this.name;
};

// Used models
const PhotoGalleryModel = mongoose.model("photo-gallery", photoGallerySchema);
const ServiceModel = mongoose.model("services", servicesSchema);
const AchievementModel = mongoose.model("achievements", achievementsSchema);
const TestimonialModel = mongoose.model("testimonials", testimonialsSchema);
const AdminModel = mongoose.model("administrator", adminSchema);

// unused models
const NewsModel = mongoose.model("news", newsSchema);
const CustomersPartnersModel = mongoose.model(
  "customers_partners",
  customersPartnersSchema
);
const NewsletterSubscriberModel = mongoose.model(
  "newsletter_subscribers",
  newsletterSubscriberSchema
);
const FaqModel = mongoose.model("faqs", faqSchema);
const TeamModel = mongoose.model("team", teamSchema);

export {
  AchievementModel,
  ServiceModel,
  PhotoGalleryModel,
  TestimonialModel,
  AdminModel,
};
