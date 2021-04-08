import { Router } from "express";
import AccountController from "../controllers/account";

const router = Router();
//Login route
router.post("/", AccountController.create);
router.get("/:id/balance", AccountController.getAccountBalance);


export default router;