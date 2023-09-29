const multer = require('multer');
const { toImageUrl } = require('../utils');

const productImagesPath = 'storage/uploads/imgs/products';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productImagesPath);
    },
    filename: (req, file, cb) => {
        const filename = req.body.imagePath;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (!Object.values(req.body).every(Boolean)) {
        return cb(null, false);
    } // Rejects the file

    const fileExtension = file.originalname.split('.').pop();

    const productName = req.body.name;

    const urlEncodedProductName = toImageUrl(productName);

    const filename = `${urlEncodedProductName}.${fileExtension}`;

    req.body.imagePath = filename;
    req.body.altText = productName;

    cb(null, true); // Accepts the file
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
});
