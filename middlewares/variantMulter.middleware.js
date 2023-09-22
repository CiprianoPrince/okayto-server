const multer = require('multer');
const db = require('../models');
const { toImageUrl } = require('../utils');
const ProductModel = db.Product;
const SizeModel = db.Size;
const ColorModel = db.Color;

const variantImagesPath = 'storage/uploads/images/variants';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, variantImagesPath);
    },
    filename: async (req, file, cb) => {
        const productId = req.params.productId;
        const sizeId = req.body.sizeId;
        const colorId = req.body.colorId;

        // Extract file extension
        const fileExtension = file.originalname.split('.').pop();

        const foundProduct = await ProductModel.findByPk(productId, { attributes: ['name'] });
        const foundSize = await SizeModel.findByPk(sizeId, { attributes: ['name'] });
        const foundColor = await ColorModel.findByPk(colorId, { attributes: ['name'] });

        const urlEncodedName = toImageUrl(foundProduct.name);
        // Construct the filename
        const filename = `${urlEncodedName}-${foundColor?.name ?? 'nocolor'}-${
            foundSize?.name ?? 'nosize'
        }.${fileExtension}`;

        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    // If the name is not in the request body, reject the file.
    if (!Object.values(req.body).every(Boolean)) return cb(null, false); // Rejects the file
    cb(null, true); // Accepts the file
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
});
