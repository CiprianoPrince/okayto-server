module.exports = {
    auth: {
        success: () => 'User successfully signed in.',
        fail: () => 'Invalid email or password.',
        error: () => `Failed to signin user.`,
    },
    refresh: {
        success: () => 'Successfully generated refresh token.',
        noCookie: () => 'No cookie found in the request.',
        expiredToken: () => 'Token has expired.',
        tokenMismatch: () => 'Token mismatch or potential tampering detected!',
        attemptedReuse: () => 'Attempted reuse of refresh token detected!',
        error: () => 'Failed to generated refresh token.',
    },
    logout: {
        success: () => 'Successfully generated refresh token',
        fail: () => 'No cookie found in the request.',
        error: () => `Failed to logout user.`,
    },
    verifyToken: {
        unauthorized: () => 'Bearer token is missing',
        forbidden: () => 'Invalid token',
    },
    verifyRole: {
        missingRole: () => 'Role is missing in the request body.',
        roleNotAllowed: () => 'Role is not allowed for this route.',
    },
    findAll: {
        success: (model, modellength) => `Successfully retrieved ${modellength} ${model}(s).`,
        fail: (model) => `No ${model}(s) found.`,
        error: (model) => `Failed to retrieve ${model} data.`,
    },
    findByPk: {
        success: (model) => `Successfully retrieved ${model}.`,
        fail: (model, modelId) => `No ${model} found with Id: ${modelId}.`,
        error: (model) => `Failed to retrieve ${model} data.`,
    },
    createOne: {
        success: (model) => `Successfully created ${model}.`,
        fail: (message) => {
            if (message) return message;
            return 'Some fields are missing or have incorrect values.';
        },
        error: (model) => `Failed to create ${model}.`,
    },
    updateOne: {
        success: (model) => `Successfully updated ${model}.`,
        fail: (model, modelId) => `No ${model} found with Id: ${modelId}.`,
        error: (model) => `Failed to update ${model}.`,
    },
    deleteOne: {
        success: (model) => `Successfully deleted ${model}.`,
        fail: (model, modelId) => `No ${model} found with Id: ${modelId}.`,
        error: (model) => `Failed to delete ${model}.`,
    },
};
