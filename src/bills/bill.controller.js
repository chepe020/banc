import Bill from "./bill.model.js";

export const getBills = async (req, res) => {
    try {
        const { role } = req.usuario;

        if (role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "Access denied. Only admins can view all invoices"
            });
        }

        const bills = await Bill.find()
            .populate("user", "name email")
            .populate("account", "noAccount balance points")
            .populate("products", "name price description");

        res.status(200).json({ bills });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error getting invoices",
            error: error.message
        });
    }
};

export const getBillByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requesterId = req.usuario._id;

        if (requesterId.toString() !== id) {
            return res.status(403).json({
                msg: "You do not have permission to view these invoices"
            });
        }

        const bills = await Bill.find({ user: id })
            .populate("user", "name email")
            .populate("account", "noAccount balance points")
            .populate("products", "name price description");

        if (bills.length === 0) {
            return res.status(404).json({
                msg: "No invoices found for this user"
            });
        }

        res.status(200).json({ bills });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error retrieving invoices",
            error: error.message
        });
    }
};