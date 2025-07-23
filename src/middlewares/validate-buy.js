import Account from "../account/account.model.js";

export const validateBuy = async (req, res, next) => {
    try {
        const { keeperUser, items } = req.body;

        if (!keeperUser || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "You must provide a user and at least one product"
            });
        }

        for (const item of items) {
            if (!item.product || item.quantity == null) {
                return res.status(400).json({
                    error: "Each item must have a product ID and a quantity"
                });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({
                    error: "The amount must be greater than 0"
                });
            }
        }

        const cuenta = await Account.findOne({ keeperUser });
        console.log(cuenta)
        if (!cuenta) {
            return res.status(404).json({
                success: false,
                msg: "Account not found for the user",
            });
        }

        req.account = cuenta;
        next();

    } catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error",
            error: error.message,
            stack: error.stack
        });
    }
};