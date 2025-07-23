import { Router } from 'express';
import { cancelTransfer, createTransfer, updateTransfer } from './transfer.controller.js';
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateTransferBase, validateTransferLimits, validateTransferEditable, validateTransferCancelable } from '../middlewares/validate-Transfer.js';

const router = Router();

router.post(
    '/makeTransfer',
    [
        validatejwt,
        validateTransferLimits,
        validateTransferBase
    ],
    createTransfer
);

router.put(
    '/putTransfers/:id',
    [
        validatejwt,
        validateTransferEditable,
        validateTransferLimits
    ],
    updateTransfer
)

router.delete(
    '/cancelTransfer/:id',
    [
        validatejwt,
        validateTransferCancelable
    ],
    cancelTransfer
)

export default router;