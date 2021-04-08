import { body, param, validationResult } from "express-validator";

export const accountCreationValidationRules = () => {
    return [
        // username must be an email
        body('customerId').exists(),
        body('type').exists(),
        body("initialDeposit").isNumeric().exists()
    ]
}

export const accountBalanceValidator = () => {
    return [
        // username must be an email
        param('id').exists(),
    ]
}



