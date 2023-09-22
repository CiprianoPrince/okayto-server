const fs = require('fs').promises;

const deleteImageSync = async (imagePath) => {
    try {
        await fs.unlink(`storage/uploads/images/${imagePath}`);
    } catch (error) {
        console.error(`Error deleting image at ${imagePath}: ${error.message}`);
    }
};

module.exports = deleteImageSync;
