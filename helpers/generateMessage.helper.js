const capitalizeFirstLetter = require('../utils/capitalizeFirstLetter.util');

module.exports = {
    all: {
        emptyData: () => 'Fields should not be empty or have an incorrect format.',
    },
    findAll: {
        success: (model, modellength) => `Successfully retrieved ${modellength} ${model}(s).`,
        missing: (model) => `No ${model}(s) found.`,
        failure: (model) => `Failed to retrieve ${model} data.`,
    },
    findByPk: {
        success: (model) => `Successfully retrieved ${model}.`,
        missing: (model) => `No ${model} found.`,
        missingID: (model, modelID) =>
            `${capitalizeFirstLetter(model)} with ID ${modelID} not found.`,
        failure: (model) => `Failed to retrieve ${model} data.`,
    },
    createOne: {
        success: (model) => `Successfully created ${model}.`,
        failure: (model) => `Failed to create ${model}.`,
    },
    updateOne: {
        success: (model) => `Successfully updated ${model}.`,
        missing: (model) => `${capitalizeFirstLetter(model)} not found.`,
        missingID: (model, modelID) => `${model} with ID ${modelID} not found.`,
        failure: (model) => `Failed to update ${model}.`,
    },
    deleteOne: {
        success: (model) => `Successfully deleted ${model}.`,
        missing: (model) => `${capitalizeFirstLetter(model)} not found.`,
        missingID: (model, modelID) =>
            `${capitalizeFirstLetter(model)} with ID ${modelID} not found.`,
        failure: (model) => `Failed to delete ${model}.`,
    },
};
