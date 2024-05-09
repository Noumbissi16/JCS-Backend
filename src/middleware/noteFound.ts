import { Request, Response } from "express";

const notFoundMiddleware = (req: Request, res: Response) => {
  return res.status(404).send("Route does not exist");
};

export default notFoundMiddleware;
