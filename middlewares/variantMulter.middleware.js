const multer = require('multer');
const db = require('../models');
const { toImageUrl } = require('../utils');
const ProductModel = db.Product;
const SizeModel = db.Size;
const ColorModel = db.Color;

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'storage/uploads/images/variants');
    },
    filename: async (request, file, cb) => {
        const productId = request.params.productId;
        const sizeId = request.body.sizeId;
        const colorId = request.body.colorId;

        // Extract file extension
        const fileExtension = file.originalname.split('.').pop();

        console.log(productId);
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

module.exports = multer({ storage: storage });
