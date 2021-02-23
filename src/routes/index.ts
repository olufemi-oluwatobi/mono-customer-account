import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import organisation from "./organisation";


const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/organisation", organisation)

export default routes;
