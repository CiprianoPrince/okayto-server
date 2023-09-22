const multer = require('multer');
const { toImageUrl } = require('../utils');

const productImagesPath = 'storage/uploads/imgs/products';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productImagesPath);
    },
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        const urlEncodedName = toImageUrl(req.body.name);
        const filename = `${urlEncodedName}.${fileExtension}`;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    // If the name is not in the request body, reject the file.
    if (!Object.values(req.body).every(Boolean)) {
        return cb(null, false);
    } // Rejects the file
    cb(null, true); // Accepts the file
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
});
