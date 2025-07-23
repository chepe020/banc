import { Router } from "express";
import { check } from "express-validator";
import { getUsers, updateUser, updateUserPassword, viewUserById } from "./user.controller.js";
import { existUserById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validateProperty, validateUserUpdate, validatePasswordChange, validateAdmin } from "../middlewares/validator-users.js"; 
const router = Router()

router.get(
    "/viewUsers", 
    validatejwt,
    validateAdmin,
    getUsers
);
router.get("/viewUserById/:id", viewUserById);

router.put(
    "/updateUser/:id",
    [
        validatejwt,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existUserById),
        validateUserUpdate,
        validateProperty,
        validarCampos
    ],
    updateUser

)

router.put(
    "/updatePassword/:id",
    [
        validatejwt,
        validateProperty,
        validatePasswordChange,
        validarCampos
    ],
    updateUserPassword
)

export default router;