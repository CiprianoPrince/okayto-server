const formatValidationError = ({ value, msg }) => {
    return {
        value,
        message: msg,
    };
};

module.exports = formatValidationError;
