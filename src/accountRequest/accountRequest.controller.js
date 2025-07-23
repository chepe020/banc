import { response, request } from 'express';
import AccountRequest from './accountRequest.model.js';
import User from '../users/user.model.js';
import { generateUniqueAccountNumber } from '../middlewares/validator-users.js';
import { hash } from 'argon2';
import Account from "../account/account.model.js";

export const createAccountRequest = async (req = request, res = response) => {
    try {
        const { password, ...rest } = req.body;

        const passwordHashed = await hash(password);

        const newRequest = new AccountRequest({
            ...rest,
            password: passwordHashed,
            status: 'pending'
        });

        await newRequest.save();

        res.status(201).json({
            success: true,
            msg: 'Solicitud enviada correctamente, en espera de aprobación'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error al crear solicitud',
            error: error.message
        });
    }
};

export const getPendingRequests = async (req = request, res = response) => {
    try {
        const requests = await AccountRequest.find({ status: 'pending' });
        res.status(200).json({
            success: true,
            total: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener solicitudes',
            error: error.message
        });
    }
};

export const updateRequestStatus = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            msg: 'Estado inválido'
        });
    }

    try {
        const requestAccount = await AccountRequest.findById(id);

        if (!requestAccount) {
            return res.status(404).json({
                success: false,
                msg: 'Solicitud no encontrada'
            });
        }

        if (requestAccount.status !== 'pending') {
            return res.status(400).json({
                success: false,
                msg: 'Solicitud ya procesada'
            });
        }

        if (status === 'approved') {
            const newUser = new User({
                name: requestAccount.name,
                username: requestAccount.username,
                dpi: requestAccount.dpi,
                direction: requestAccount.direction,
                phone: requestAccount.phone,
                email: requestAccount.email,
                password: requestAccount.password, 
                work: requestAccount.work,
                nombreEmpresa: requestAccount.nombreEmpresa,
                income: requestAccount.income,
                typeAccount: requestAccount.typeAccount,
                role: 'USER_ROLE',
                status: true
            });

            newUser.noAccount = await generateUniqueAccountNumber();
            await newUser.save();

            await Account.create({
                keeperUser: newUser._id,
                noAccount: newUser.noAccount,
                typeAccount: newUser.typeAccount,
                balance: 0,
                points: 0
            });

            requestAccount.status = 'approved';
            requestAccount.rejectionReason = null;
            await requestAccount.save();

            return res.status(200).json({
                success: true,
                msg: 'Usuario aprobado, cuenta bancaria creada con éxito'
            });

        } else {
            requestAccount.status = 'rejected';
            requestAccount.rejectionReason = rejectionReason || 'Sin motivo especificado';
            await requestAccount.save();

            return res.status(200).json({
                success: true,
                msg: 'Solicitud rechazada'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar estado de solicitud',
            error: error.message
        });
    }
};