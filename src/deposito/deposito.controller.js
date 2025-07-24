import Deposito from './deposito.model.js';
import Account from '../account/account.model.js';

export const createDeposito = async (req, res) => {
    const { noAccount, monto } = req.body;
    const cuenta = await Account.findOne({noAccount: noAccount});
    console.log('noAccount recibido:', noAccount);
    try {
        const deposito = new Deposito({
            keeperAccount: cuenta._id,
            monto,
            noAccount
        });

        const savedDeposito = await deposito.save();

        cuenta.balance += monto;
        await cuenta.save();

        return res.status(200).json({
            message: "Deposito created successfully",
            deposito: savedDeposito
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error create deposito",
            error: error.message,
        });
    }
};

export const getDepositos = async (req, res) => {
    const { limite = 100, desde = 0 } = req.query;
    const { searchByNoAccount } = req.query;
    const query = { state: true };

    try {
        if (searchByNoAccount) {
            query.noAccount = { $regex: new RegExp(searchByNoAccount, 'i') };
        }

        const depositos = await Deposito.find(query)
            .skip(Number(desde))
            .limit(Number(limite));


        res.status(200).json({
            success: true,
            total: depositos.length,
            depositos
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting depositos",
            error: error.message
        });
    }
};



