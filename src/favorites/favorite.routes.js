import { Router } from "express";
import {
    addFavorite,
    getFavoritesByAccount,
    getAllFavorites,
    editFavorite,
    deleteFavorite
} from "../favorites/favorite.controller.js";
import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validateAdmin } from "../middlewares/validator-users.js"; 

const router = Router();

router.post(
    "/addFavorite",
    [validatejwt, validarCampos],
    addFavorite
);

router.get(
    "/viewFavorites",
    [validatejwt, validarCampos],
    getFavoritesByAccount
);

router.get(
    "/viewAllFavorites",
    [validatejwt, validateAdmin, validarCampos],    
    getAllFavorites
);

router.put(
    "/editFavorite/:id",
    [validatejwt, validarCampos],    
    editFavorite
);

router.delete(
    "/deleteFavorite/:id",
    [validatejwt, validarCampos],
    deleteFavorite
);

export default router;
