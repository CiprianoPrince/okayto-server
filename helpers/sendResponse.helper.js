const { getReasonPhrase } = require('http-status-codes');

module.exports = (res, status, message, data = null, errors = null, errorCode = null) => {
    const responseObject = {
        status,
        statusCode: getReasonPhrase(status),
        message,
    };

    if (data) responseObject.data = data;
    if (errors) responseObject.errors = errors;
    if (errorCode) responseObject.errorCode = errorCode;

    const httpStatus = status;
    return res.status(httpStatus).send(responseObject);
};
