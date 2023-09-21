module.exports = async (filePath) => {
    const fs = require('fs');
    const util = require('util');

    // Convert fs.readFile into a Promise-based function
    const readFile = util.promisify(fs.readFile);

    try {
        const data = await readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data);
        return jsonObject;
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
        throw err;
    }
};
