import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-JWT.js";
import { Router } from "express";
import { check } from "express-validator";
import { validateAdmin } from "../middlewares/validator-users.js"; 

import { addPorducts, getProducts, getProductsByUserId, updateProduct, deleteProduct } from "./product.controller.js";

const router = Router();

router.post(
    "/addProduct",
    [
        validarCampos
    ],
    addPorducts
);

router.get("/getProducts", getProducts);
router.post("/getProductsByUserId", getProductsByUserId);  //Cambio de GET a POST

router.put(
    "/updateProduct/:id",
    [
        validarCampos,
        check("id", "Not a valid ID").isMongoId()
    ],
    updateProduct
);

router.delete(
    "/deleteProduct/:id",
    [
        validarCampos,
        check("id", "Not a valid ID").isMongoId()
    ],
    deleteProduct
);

export default router;