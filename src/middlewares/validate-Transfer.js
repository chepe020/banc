import Account from '../account/account.model.js';
import Transfer from '../transfer/transfer.model.js';

export const validateTransferBase = async (req, res, next) => {
    try {
        const fromUser = req.usuario._id;
        const { toAccount, amount } = req.body;

        if (!toAccount || !amount) {
            return res.status(400).json({ msg: 'toAccount and amount are required' });
        }

        const senderAccount = await Account.findOne({ keeperUser: fromUser });
        if (!senderAccount) {
            return res.status(404).json({ msg: 'Sender account not found' });
        }

        const receiverAccount = await Account.findOne({ noAccount: toAccount });
        if (!receiverAccount) {
            return res.status(404).json({ msg: 'Recipient account not found' });
        }

        if (senderAccount.noAccount === toAccount) {
            return res.status(400).json({ msg: 'You cannot transfer to your own account' });
        }

        const commissionPercentage = 3.5;
        const commissionAmount = (amount * commissionPercentage) / 100;
        const totalToDeduct = amount + commissionAmount;

        if (senderAccount.balance < totalToDeduct) {
            return res.status(400).json({ msg: 'Insufficient balance to cover amount and commission' });
        }

        req.senderAccount = senderAccount;
        req.receiverAccount = receiverAccount;
        req.commissionAmount = commissionAmount;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error validating transfer' });
    }
};

export const validateTransferLimits = async (req, res, next) => {
    try {
        const fromUser = req.usuario._id;
        const { amount } = req.body;

        if (amount > 2000) {
            return res.status(400).json({ msg: 'Transfers over 2000 are not allowed' });
        }

        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutos atrás

        const recentTransfers = await Transfer.find({
            fromUser,
            createdAt: { $gte: fiveMinutesAgo }
        });

        const totalTransferred = recentTransfers.reduce((sum, t) => sum + t.amount, 0);

        if (totalTransferred + amount > 10000) {
            return res.status(400).json({ msg: 'Transfer limit of 10000 exceeded within 5 minutes' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error checking transfer limits' });
    }
};

export const validateTransferEditable = async (req, res, next) => {
    const { id } = req.params;

    try {
        const transfer = await Transfer.findById(id);
        if (!transfer) {
            return res.status(404).json({ msg: 'Transfer not found' });
        }

        const userId = req.usuario._id;
        if (!transfer.fromUser.equals(userId)) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const now = new Date();
        const created = new Date(transfer.createdAt);
        const diffMinutes = (now - created) / 1000 / 60;
        if (diffMinutes > 5) {
            return res.status(400).json({ msg: 'Transfer can no longer be edited after 5 minutes' });
        }

        req.transfer = transfer;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error validating transfer' });
    }
};

export const validateTransferCancelable = async (req, res, next) => {
    const { id } = req.params;

    try {
        const transfer = await Transfer.findById(id);
        if (!transfer) {
            return res.status(404).json({ msg: 'Transfer not found' });
        }

        const userId = req.usuario._id;

        if (!transfer.fromUser.equals(userId)) {
            return res.status(403).json({ msg: 'You are not authorized to cancel this transfer' });
        }

        const now = new Date();
        const createdAt = new Date(transfer.createdAt);
        const diffMinutes = (now - createdAt) / 1000 / 60;

        if (diffMinutes > 3) {
            return res.status(400).json({ msg: 'The transfer can no longer be cancelled (time limit exceeded)' });
        }

        req.transfer = transfer;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error validating transfer cancellation' });
    }
};