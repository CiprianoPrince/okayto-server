const { ROLES } = require('../constants');

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(ROLES.Guest)) return next();
        const currentRole = req?.role;
        if (!currentRole) return res.sendStatus(401);

        if (!allowedRoles.includes(currentRole)) return res.sendStatus(401);
        next();
    };
};
