import Transfer from "./transfer.model.js";
import History from "../history/history.model.js"
import Account from "../account/account.model.js";

export const createTransfer = async (req, res) => {
    try {
        const fromUser = req.usuario._id;
        const { toAccount, amount, description } = req.body;

        const senderAccount = req.senderAccount;
        const receiverAccount = req.receiverAccount;
        const commissionAmount = req.commissionAmount || 0;

        const totalToDeduct = amount + commissionAmount;

        senderAccount.balance -= totalToDeduct;
        receiverAccount.balance += amount;

        await senderAccount.save();
        await receiverAccount.save();

        const newTransfer = new Transfer({
            fromUser,
            toAccount,
            amount,
            description
        });

        await newTransfer.save();

        await Account.findOneAndUpdate(
            { noAccount: toAccount },
            { $inc: { countTransactions: 1 } },
            { new: true }
        );

        const historyEntry = new History({
            fromUser,
            toUser: receiverAccount.keeperUser,
            amount,
            description,
            transfer: newTransfer._id
        });

        await historyEntry.save();

        res.status(201).json({
            msg: 'Transfer completed successfully',
            transfer: newTransfer,
            commissionCharged: commissionAmount.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error processing transfer' });
    }
};

export const updateTransfer = async (req, res) => {
    try {
        const { toAccount, amount, description } = req.body;
        const userId = req.usuario._id;
        const transfer = req.transfer;

        const senderAccount = await Account.findOne({ keeperUser: userId });
        if (!senderAccount) {
            return res.status(404).json({ msg: 'Sender account not found' });
        }

        const oldReceiverAccount = await Account.findOne({ noAccount: transfer.toAccount });
        if (!oldReceiverAccount) {
            return res.status(404).json({ msg: 'Original recipient account not found' });
        }

        const originalCommission = (transfer.amount * 3.5) / 100;
        senderAccount.balance += transfer.amount + originalCommission;
        oldReceiverAccount.balance -= transfer.amount;

        let newReceiverAccount = oldReceiverAccount;
        if (toAccount && toAccount !== transfer.toAccount) {
            newReceiverAccount = await Account.findOne({ noAccount: toAccount });
            if (!newReceiverAccount) {
                return res.status(404).json({ msg: 'New recipient account not found' });
            }
        }

        const newAmount = amount ?? transfer.amount;
        const newCommission = (newAmount * 3.5) / 100;
        const totalToDeduct = newAmount + newCommission;

        if (senderAccount.balance < totalToDeduct) {
            return res.status(400).json({ msg: 'Insufficient balance for updated transfer' });
        }

        senderAccount.balance -= totalToDeduct;
        newReceiverAccount.balance += newAmount;

        await Promise.all([
            senderAccount.save(),
            oldReceiverAccount.save(),
            newReceiverAccount !== oldReceiverAccount ? newReceiverAccount.save() : null
        ]);

        let updated = false;
        if (toAccount && toAccount !== transfer.toAccount) {
            transfer.toAccount = toAccount;
            updated = true;
        }
        if (amount && amount !== transfer.amount) {
            transfer.amount = amount;
            updated = true;
        }
        if (description && description !== transfer.description) {
            transfer.description = description;
            updated = true;
        }

        if (updated) {
            await transfer.save();
        }

        res.status(200).json({
            msg: 'Transfer updated successfully',
            transfer,
            commissionCharged: newCommission.toFixed(2)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error updating transfer' });
    }
};

export const cancelTransfer = async (req, res) => {
    try {
        const transfer = req.transfer;
        const userId = req.usuario._id;

        const senderAccount = await Account.findOne({ keeperUser: userId });
        const receiverAccount = await Account.findOne({ noAccount: transfer.toAccount });

        if (!senderAccount || !receiverAccount) {
            return res.status(404).json({ msg: 'Sender or receiver account not found' });
        }

        const commissionAmount = (transfer.amount * 3.5) / 100;
        const totalRefund = transfer.amount + commissionAmount;

        senderAccount.balance += totalRefund;
        receiverAccount.balance -= transfer.amount;

        await Promise.all([
            senderAccount.save(),
            receiverAccount.save(),
            Transfer.findByIdAndDelete(transfer._id),
            History.deleteOne({ transfer: transfer._id })
        ]);

        res.status(200).json({ msg: 'Transfer successfully cancelled and funds reverted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error cancelling transfer' });
    }
};