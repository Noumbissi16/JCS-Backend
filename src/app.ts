require("express-async-errors");
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import connectDB from "./db/connect";
import notFoundMiddleware from "./middleware/noteFound";
import errorHandlerMiddleware from "./middleware/error-handler";
// security packages
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const { MONGODB_URI } = process.env;

const app: Application = express();

const port = process.env.PORT || 8000;
// middleware
app.use(express.json());
// Use Helmet!
app.use(helmet());
// To remove data using these defaults:
app.use(mongoSanitize());
// use cors
app.use(cors());
// use ratelimit
app.set("trust proxy", 1 /* number of proxies between user and server */);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
// routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to JCS Group API");
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    if (MONGODB_URI) {
      await connectDB(MONGODB_URI!);
      app.listen(port, () => {
        console.log("Server is fire at port " + port);
      });
    } else {
      console.log("MONGODB_URI not found");
    }
  } catch (error) {
    console.log(error);
  }
};

start();
