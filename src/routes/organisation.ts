import { Router } from "express";
import OrganisationController from "../controllers/Organisation";
import { Organisation } from "../entity";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/", [checkJwt], OrganisationController.create);
router.get("/", [checkJwt], OrganisationController.index)
router.get("/:slug", [checkJwt], OrganisationController.show)

//Change my password

export default router;