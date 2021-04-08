import { Router } from "express";
import TransactionController from "../controllers/transaction";
import validate from "../../middlewares/validation"
import { transactionCreationValidation, transactionHistoryValidation } from "../validation/transactionValidation"

const router = Router();
//Login route
router.post("/", transactionCreationValidation(), validate, TransactionController.create);
router.get("/history/:accountId", transactionHistoryValidation(), validate, TransactionController.history);


export default router;