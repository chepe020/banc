import { Router } from 'express';
import { createDeposito, getDepositos } from './deposito.controller.js';
import { validatejwt } from '../middlewares/validate-jwt.js';
import { validateAdmin } from "../middlewares/validator-users.js"; 

const router = Router();

router.post(
    '/createDeposito',
    [
        validatejwt,
        validateAdmin
    ],
    createDeposito
);

router.get(
    '/getDepositos',
    [
        validatejwt,
        validateAdmin
    ],
    getDepositos
);

export default router;