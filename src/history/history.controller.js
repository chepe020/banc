import History from './history.model.js';
import User from '../users/user.model.js';

export const getAllHistories = async (req, res) => {
    try {
        const user = req.usuario;

        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ 
                msg: 'Access denied. Admins only' 
            });
        }

        const histories = await History.find()
            .populate('fromUser', 'name noAccount ')
            .populate('toUser', 'name noAccount ')
            .sort({ createdAt: -1 });

        res.json({ histories });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error retrieving histories'
        });
    }
};

export const getHistoryFromUser = async (req, res) => {
    try {
        const userId = req.usuario._id;

        const histories = await History.find({ fromUser: userId })
            .populate('toUser', 'name noAccount')
            .sort({ createdAt: -1 });

        res.json({ histories });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error retrieving user histories'
        });
    }
};