import Buy from "./buy.model.js";
import Product from "../products/product.model.js";
import Bill from "../bills/bill.model.js";

export const createBuy = async (req, res) => {
    try {
        const { keeperUser, items } = req.body;
        const cuenta = req.account;

        let total = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || !product.state) {
                return res.status(404).json({
                    success: false,
                    msg: `Product with ID ${item.product} not found`,
                });
            }

            const subtotal = product.price * item.quantity;
            total += subtotal;

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
            });
        }

        if (cuenta.balance < total) {
            return res.status(400).json({
                success: false,
                msg: "Insufficient balance at the time of purchase"
            });
        }

        const newBuy = new Buy({
            keeperUser,
            items: processedItems,
            totalTransaccion: total,
        });

        const savedBuy = await newBuy.save();

        cuenta.balance -= total;
        await cuenta.save();

        const newBill = new Bill({
            account: cuenta._id,
            user: keeperUser,
            products: processedItems.map(item => item.product),
            total,
        });

        const savedBill = await newBill.save();

        return res.status(200).json({
            message: "Purchase and invoice created successfully",
            compra: savedBuy,
            factura: savedBill,
        });
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({
            success: false,
            message: "Error when making the purchase",
            error: error.message,
        });
    }
};

export const createBuyByPoints = async (req, res) => {
    try {
        const { keeperUser, items } = req.body;
        const cuenta = req.account;

        let total = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || !product.state) {
                return res.status(404).json({
                    success: false,
                    msg: `Product with ID ${item.product} not found`,
                });
            }

            const subtotal = product.price * item.quantity;
            total += subtotal;

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
            });
        }

        if (cuenta.points < total) {
            return res.status(400).json({
                success: false,
                msg: "Insufficient points at the time of purchase"
            });
        }

        const newBuy = new Buy({
            keeperUser,
            items: processedItems,
            totalTransaccion: total,
        });

        const savedBuy = await newBuy.save();

        cuenta.points -= total;
        await cuenta.save();

        const newBill = new Bill({
            account: cuenta._id,
            user: keeperUser,
            products: processedItems.map(item => item.product),
            total,
        });

        const savedBill = await newBill.save();

        return res.status(200).json({
            message: "Purchase and invoice created successfully",
            compra: savedBuy,
            factura: savedBill,
        });
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({
            success: false,
            message: "Error when making the purchase",
            error: error.message,
        });
    }
};

export const getBuys = async (req, res) => {
    try {
        const { role } = req.usuario;

        if (role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "Access denied. Only admins can view all purchases"
            });
        }
        const buys = await Buy.find().populate('keeperUser', 'name username email');

        res.status(200).json(buys);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            msg: "Error getting purchases",
            error: e.message
        });
    }
};

export const getBuyByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requesterId = req.usuario._id;
        const requesterRole = req.usuario.role;

        if (requesterId.toString() !== id && requesterRole !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "You do not have permission to view these purchases"
            });
        }

        const buys = await Buy.find({ keeperUser: id })
            .populate('keeperUser', 'name noAccount balance username email');

        if (!buys || buys.length === 0) {
            return res.status(404).json({
                msg: "No purchases found for this user"
            });
        }

        res.status(200).json(buys);

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            msg: "Error getting purchases",
            error: e.message
        });
    }
};