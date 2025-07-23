import { response, request } from 'express';
import Favorite from './favorite.model.js';
import Account from '../account/account.model.js'; 

export const addFavorite = async (req = request, res = response) => {
    
    const userId = req.usuario._id;
    const {alias, noAccount} = req.body;
    const acount = await Account.findOne({noAccount: noAccount});
    console.log(acount);
    try {
        if (!userId) {
            return res.status(400).json({
                success: false,
                msg: "El ID del usuario es requerido"
            });
        }
        const favorites = new Favorite({
            user : userId,
            favoriteAccount: acount._id,
            alias
        })

        await favorites.save();

        res.status(200).json({
            success: true, 
            msg: 'Cuenta agregada a favoritos con exito',
            favorites
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error adding favorite",
            error: error.message
        });
    }
};

export const getFavoritesByAccount = async (req = request, res = response) => {
    const userId = req.usuario._id;
    try {
        const { searchByAlias } = req.query;
        const query = { isFavorite: true, user: userId };

        if (searchByAlias) {
            query.alias = { $regex: new RegExp(searchByAlias, 'i') };
        }

        const favorites = await Favorite.find(query)
            .populate('favoriteAccount', 'noAccount typeAccount countTransactions')
            .populate('user', 'username noAccount');

        const topFavorites = favorites
            .filter(fav => fav.favoriteAccount && typeof fav.favoriteAccount.countTransactions === 'number')
            .sort((a, b) => b.favoriteAccount.countTransactions - a.favoriteAccount.countTransactions)
            .slice(0, 3);

        res.status(200).json({
            success: true,
            total: topFavorites.length,
            favorites: topFavorites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error fetching top favorites",
            error: error.message
        });
    }
};

export const getAllFavorites = async (req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { isFavorite: true };

    try {
        const favorites = await Favorite.find(query)
            .populate('favoriteAccount', 'noAccount typeAccount')
            .populate('user', 'username noAccount')
            .skip(Number(desde))
            .limit(Number(limite)); 

        const total = await Favorite.countDocuments(query); 

        res.status(200).json({
            success: true,
            total,
            favorites
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "Error al obtener favoritos",
            error: error.message
        });
    }
};

export const editFavorite = async (req = request, res = response) => { 
    const { id } = req.params;
    const { alias } = req.body;     
    try {
        const favorite = await Favorite.findByIdAndUpdate(id, { alias }, { new: true });    

        res.status(200).json({
            success: true,
            msg: "Favorito actualizado correctamente",
            favorite
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "Error al editar favorito",
            error: error.message,
        })
    }
};

export const deleteFavorite = async (req = request, res = response) => {
    const { id } = req.params;
    const { confirm } = req.body;
    try {
        if (!confirm){
            return res.status(400).json({
                success: false,
                msg: "Confirmación requerida"
            });
        }

        const deletedFavorite = await Favorite.findByIdAndUpdate(id , { isFavorite: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Favorite removed successfully",
            deletedFavorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error deleting favorite",
            error: error.message
        });         
    }
};
