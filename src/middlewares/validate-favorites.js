import { check } from 'express-validator';
import { existAccountById } from '../helpers/db-validator.js'; 

export const validateAddFavorite = [
    check("accountId", "Invalid account ID").isMongoId(),
    check("favoriteAccountId", "Invalid favorite account ID").isMongoId(),
    check("accountId").custom(existAccountById),
    check("favoriteAccountId").custom(existAccountById)
];

export const validateGetFavorites = [
    check("accountId", "Invalid account ID").isMongoId(),
    check("accountId").custom(existAccountById)
];

export const validateToggleFavorite = [
    check("accountId", "Invalid account ID").isMongoId(),
    check("favoriteAccountId", "Invalid favorite account ID").isMongoId(),
    check("accountId").custom(existAccountById),
    check("favoriteAccountId").custom(existAccountById)
];

export const validateDeleteFavorite = [
    check("accountId", "Invalid account ID").isMongoId(),
    check("favoriteAccountId", "Invalid favorite account ID").isMongoId(),
    check("accountId").custom(existAccountById),
    check("favoriteAccountId").custom(existAccountById)
];

export const validateUpdateAlias = [
    check("accountId", "accountId is required and must be a valid Mongo ID").isMongoId(),
    check("favoriteAccountId", "favoriteAccountId is required and must be a valid Mongo ID").isMongoId(),
    check("alias", "alias must be a non-empty string").isString().notEmpty()
];
