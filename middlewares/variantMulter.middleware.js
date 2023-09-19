const multer = require('multer');
const toImageUrl = require('../../utils/toImageUrl');
const db = require('../../models');
const ProductModel = db.Product;
const SizeModel = db.Size;
const ColorModel = db.Color;

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'storage/uploads/images/variants');
    },
    filename: async (request, file, cb) => {
        const productID = request.params.productID;
        const sizeID = request.body.sizeID;
        const colorID = request.body.colorID;

        // Extract file extension
        const fileExtension = file.originalname.split('.').pop();

        console.log(productID);
        const foundProduct = await ProductModel.findByPk(productID, { attributes: ['name'] });
        const foundSize = await SizeModel.findByPk(sizeID, { attributes: ['name'] });
        const foundColor = await ColorModel.findByPk(colorID, { attributes: ['name'] });

        const urlEncodedName = toImageUrl(foundProduct.name);
        // Construct the filename
        const filename = `${urlEncodedName}-${foundColor?.name ?? 'nocolor'}-${
            foundSize?.name ?? 'nosize'
        }.${fileExtension}`;

        cb(null, filename);
    },
});

module.exports = multer({ storage: storage });
