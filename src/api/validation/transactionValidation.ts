import { body, param, validationResult } from "express-validator";

export const transactionCreationValidation = () => {
    return [
        // username must be an email
        body('senderAccountId').exists(),
        body('recipientAccountId').exists(),
        body("amount").isNumeric().exists(),
        body("currency").exists()
    ]
}

export const transactionHistoryValidation = () => {
    return [
        // username must be an email
        param('accountId').exists(),
    ]
}



