module.exports = (fileName) => {
    const path = require('path');
    const basename = path.basename(fileName);
    return basename.slice(0, basename.indexOf('.'));
};
