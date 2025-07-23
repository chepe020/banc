import { Router } from "express";
import { check } from "express-validator";
import { validateBuy } from "../middlewares/validate-buy.js";
import { createBuy, getBuys, getBuyByUser, createBuyByPoints } from "../buys/buy.controller.js";
import { validatejwt } from "../middlewares/validate-jwt.js";

const router = Router()

router.post(
    "/",
    [
        validatejwt,
        validateBuy
    ],
    createBuy
);

router.post(
    "/points/",
    [
        validatejwt,
        validateBuy
    ],
    createBuyByPoints
)

router.get(
    "/",
    validatejwt, 
    getBuys
);

router.get(
    "/:id",
    [
        check("id","Not a valid ID").isMongoId()
    ],
    getBuyByUser
)

export default router;