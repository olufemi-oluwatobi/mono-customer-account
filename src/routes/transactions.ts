import { Router } from "express";
import TransactionController from "../controllers/transaction";

const router = Router();
//Login route
router.post("/", TransactionController.create);
router.get("/history/:accountId", TransactionController.history);


export default router;