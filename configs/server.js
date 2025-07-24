'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import limiter from '../src/middlewares/validate-cant-peticiones.js';
import { dbConnection } from './mongo.js';
import { createAdmin } from '../src/auth/auth.controller.js';
import { createRoles } from '../src/role/role.controller.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import accountRoutes from "../src/account/account.routes.js";
import favoriteRoutes from '../src/favorites/favorite.routes.js';
import buyRoutes from "../src/buys/buy.routes.js";
import billRoutes from "../src/bills/bill.routes.js";
import transferRoutes from "../src/transfer/transfer.routes.js";
import historyRoutes from "../src/history/history.routes.js";
import productRoutes from "../src/products/product.routes.js"
import accountRequestRoutes from "../src/accountRequest/accountRequest.routes.js";
import { rewardPointsService } from '../src/account/account.controller.js';
import depositoRoutes from "../src/deposito/deposito.routes.js";


const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/BancoSystem/v1/auth', authRoutes);
    app.use('/BancoSystem/v1/users', userRoutes);
    app.use('/BancoSystem/v1/account', accountRoutes); 
    app.use('/BancoSystem/v1/favorites', favoriteRoutes);
    app.use('/BancoSystem/v1/buy', buyRoutes); 
    app.use('/BancoSystem/v1/bill', billRoutes); 
    app.use('/BancoSystem/v1/transfer', transferRoutes);
    app.use('/BancoSystem/v1/history', historyRoutes); 
    app.use('/BancoSystem/v1/products', productRoutes);   
    app.use('/BancoSystem/v1/accountRequest', accountRequestRoutes);  
    app.use('/BancoSystem/v1/deposito', depositoRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        await createRoles();
        console.log(`Server running on port: ${port}`);
        await createAdmin();
        setInterval(rewardPointsService, 5 * 60 * 1000); // Cada 5 minutos
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}