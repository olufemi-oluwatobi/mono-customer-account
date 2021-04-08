import { Router } from "express";
import AccountController from "../controllers/account";
import validate from "../../middlewares/validation"
import { accountCreationValidationRules, accountBalanceValidator } from "../validation/accountValidators"

const router = Router();
//Login route
router.post("/", accountCreationValidationRules(), validate, AccountController.create);
router.get("/:id/balance", accountBalanceValidator(), validate, AccountController.getAccountBalance);


export default router;