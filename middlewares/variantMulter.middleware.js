const fs = require('fs');
const multer = require('multer');
const db = require('../models');
const { toImageUrl } = require('../utils');
const Product = db.Product;
const ProductColor = db.ProductColor;
const Color = db.Color;

const VARIANT_IMAGE_PATH = 'storage/uploads/imgs/variants';
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `${VARIANT_IMAGE_PATH}/${req.body.productName}`;

        // Check if directory exists, and if not, create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // The recursive option ensures that parent directories are created if they don't exist
        }

        delete req.body.productName;

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const filename = req.body.imagePath;
        cb(null, filename);
    },
});

const fileFilter = async (req, file, cb) => {
    try {
        const productId = req.params.productId;
        const colorId = req.body.colorId;

        const foundProductColor = await ProductColor.findOne({
            where: { productId, colorId },
        });

        if (foundProductColor) {
            req.body.productColorId = foundProductColor.productColorId;
            return cb(null, false);
        }

        const fileExtension = file.originalname.split('.').pop();

        // Check if the file extension is allowed
        if (!ALLOWED_EXTENSIONS.includes(fileExtension.toLowerCase())) {
            return cb(null, false);
        }

        const [foundProduct, foundColor] = await Promise.all([
            Product.findByPk(productId, { attributes: ['name'] }),
            Color.findByPk(colorId, { attributes: ['name'] }),
        ]);

        if (!foundProduct || !foundColor) {
            return cb(null, false);
        }

        const productName = foundProduct.name;
        const colorName = foundColor.name;

        const variantName = `${productName} ${colorName}`;
        const urlEncodedVariantName = toImageUrl(variantName);

        const filename = `${urlEncodedVariantName}.${fileExtension}`;

        req.body.productName = toImageUrl(foundProduct.name);
        req.body.imagePath = filename;
        req.body.altText = variantName;

        cb(null, true);
    } catch (error) {
        cb(null, false);
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
});
