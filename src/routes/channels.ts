import { Router } from "express";
import ChannelController from "../controllers/ChannelController";
import { Organisation } from "../entity";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/:organisationId", [checkJwt], ChannelController.create);
router.get("/:organisationSlug", [checkJwt], ChannelController.index);


//Change my password

export default router;