const capitalizeFirstLetter = require('../utils/capitalizeFirstLetter.util');

module.exports = {
    findAll: {
        success: (model, modellength) => `Successfully retrieved ${modellength} ${model}(s).`,
        fail: (model) => `No ${model}(s) found.`,
        error: (model) => `Failed to retrieve ${model} data.`,
    },
    findByPk: {
        success: (model) => `Successfully retrieved ${model}.`,
        fail: (model, modelID) => `No ${model} found with ID: ${modelID}.`,
        error: (model) => `Failed to retrieve ${model} data.`,
    },
    createOne: {
        success: (model) => `Successfully created ${model}.`,
        fail: () => 'Fields should not be empty or have an incorrect format.',
        error: (model) => `Failed to create ${model}.`,
    },
    updateOne: {
        success: (model) => `Successfully updated ${model}.`,
        fail: (model, modelID) => `No ${model} found with ID: ${modelID}.`,
        error: (model) => `Failed to update ${model}.`,
    },
    deleteOne: {
        success: (model) => `Successfully deleted ${model}.`,
        fail: (model, modelID) => `No ${model} found with ID: ${modelID}.`,
        error: (model) => `Failed to delete ${model}.`,
    },
};
