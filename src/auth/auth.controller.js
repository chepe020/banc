import User from "../users/user.model.js";
import Account from "../account/account.model.js";
import { hash, verify } from "argon2";
import { generateJWT } from "../helpers/generate-jwt.js";

export const login = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const user = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        })
        if (!user) {
            return res.status(400).json({
                msg: "User or password incorrect",
                success: false
            })
        }
        if (!user.status) {
            return res.status(400).json({
                msg: "The user does not exist in the database",
                success: false
            })
        }
        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Password incorrect",
                success: false
            })
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            msg: "Login successful",
            userDetails: {
                username: user.username,
                email: user.email,
                token: token,
                role: user.role,
                id: user.id,
                typeAccount: user.typeAccount
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Contact the administrator",
            error: error.message
        });
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);
        const user = await User.create({
            ...data,
            password: encryptedPassword,
        })

        await Account.create({
            keeperUser: user._id,
            noAccount: user.noAccount,
            typeAccount: user.typeAccount,
            balance: 0,
            points: 0
        });

        return res.status(200).json({
            msg: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Contact the administrator",
            error: error.message
        })
    }
}

export const createAdmin = async () => {
    try {
        const role = 'ADMIN_ROLE';

        const existsAdmin = await User.findOne({ role });
        if (existsAdmin) {
            console.log('An ADMIN_ROLE user already exists. Cannot create another one.');
            return null;
        }

        const hashedPassword = await hash('1234567890');

        const adminUser = new User({
            name: 'Admin',
            username: 'admin',
            dpi: '3976668450101',
            direction: 'Admin Address',
            phone: '00000000',
            email: 'admin@gmail.com',
            password: hashedPassword,
            work: 'Admin',
            income: 1000,
            role,
            typeAccount: 'NORMAL'
        });

        await adminUser.save();

        console.log({
            name: adminUser.name,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role
        });

        return adminUser;

    } catch (error) {
        console.error('Error creating admin:', error);
        return null;
    }
};
