const { ROLES } = require('../constants');
const { sendResponse, generateMessage } = require('../helpers');
const { StatusCodes } = require('http-status-codes');

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(ROLES.GUEST)) return next();
        console.log(req?.role);
        const currentRole = req?.role;
        if (!currentRole) {
            return sendResponse(
                res,
                StatusCodes.UNAUTHORIZED,
                generateMessage.verifyRole.missingRole()
            );
        }

        if (!allowedRoles.includes(currentRole)) {
            return sendResponse(
                res,
                StatusCodes.UNAUTHORIZED,
                generateMessage.verifyRole.roleNotAllowed()
            );
        }
        next();
    };
};
