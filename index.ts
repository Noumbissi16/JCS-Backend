require("express-async-errors");
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import userRoutes from "./src/routes/users";
import adminRoutes from "./src/routes/admin";
import connectDB from "./src/db/connect";
import notFoundMiddleware from "./src/middleware/noteFound";
import errorHandlerMiddleware from "./src/middleware/error-handler";
import authMiddleware from "./src/middleware/authenticationMiddleware";
// security packages
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import rateLimit from "express-rate-limit";

const docs = require("./docs.swagger.json");

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
  res.send(
    "Welcome to JCS Group API <h1><a href='/api-docs'>Go to docs</a></h1>"
  );
});

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(docs, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css",
  })
);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/auth", adminRoutes);
app.use("/api/v1/admin", authMiddleware, adminRoutes);
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
