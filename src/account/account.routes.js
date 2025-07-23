import { getAccount, getAllAccounts } from "./account.controller.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validateAdmin } from "../middlewares/validator-users.js";
import { validateAccountQuery } from "../middlewares/validate-account-query.js";
import { Router } from "express";

const router = Router();

router.get(
    '/searchAccount',
    validateAccountQuery,
    getAccount
)

router.get(
    '/getAccount',
    [
        validatejwt,
        validateAdmin
    ],
    getAllAccounts
)

export default router;