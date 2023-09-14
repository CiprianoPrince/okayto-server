module.exports = {
    credentials: require('./credentials.middleware'),
    errorLogger: require('./errorLogger.middleware'),
    verifyJwt: require('./verifyJwt.middleware'),
    verifyRolese: require('./verifyRoles.middleware'),
};
