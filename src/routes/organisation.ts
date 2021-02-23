import { Router } from "express";
import OrganisationController from "../controllers/Organisation";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/", [checkJwt], OrganisationController.create);

//Change my password

export default router;