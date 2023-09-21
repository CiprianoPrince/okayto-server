module.exports = {
    credentials: require('./credentials.middleware'),
    errorLogger: require('./errorLogger.middleware'),
    verifyJwt: require('./verifyJwt.middleware'),
    verifyRoles: require('./verifyRoles.middleware'),
    uploadProductImage: require('./productMulter.middleware'),
    uploadVariantImage: require('./variantMulter.middleware'),
};
