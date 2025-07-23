export const validateAccountQuery = (req, res, next) => {
    const { noAccount, id } = req.query;

    if (!noAccount && !id) {
        return res.status(400).json({
            success: false,
            msg: 'Debe proporcionar al menos noAccount o id como parámetro de búsqueda'
        });
    }

    if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            msg: 'El ID proporcionado no es válido (debe tener 24 caracteres hexadecimales)'
        });
    }

    next();
};