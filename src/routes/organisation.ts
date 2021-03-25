import { Router } from "express";
import OrganisationController from "../controllers/Organisation";
import { Organisation } from "../entity";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/", [checkJwt], OrganisationController.create);
router.get("/", [checkJwt], OrganisationController.index);
router.get("/:slug/member_chat", [checkJwt], OrganisationController.userMessages)
router.post("/:id/reject/:invitationId", [checkJwt], OrganisationController.reject)
router.post("/accept/:invitationId", [checkJwt], OrganisationController.accept)
router.get("/invites/:inviteId", [checkJwt], OrganisationController.invites)
router.get("/:slug", [checkJwt], OrganisationController.show)
router.post("/:slug/invite", [checkJwt], OrganisationController.invite)


//Change my password

export default router;