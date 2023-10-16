const { PATHS } = require('../constants');
const { toImageUrl } = require('../utils');

const formatProductVariant = (foundProductVariant) => {
    const {
        variantId,
        Size: size,
        Inventory: inventory,
        ProductColor: { Product: product, Color: color, VariantImage: image },
    } = foundProductVariant;

    const { variantImageId: imageId, imagePath, altText } = image;

    const productDirectory = toImageUrl(product.name);

    const formattedProductVariant = {
        variantId,
        product,
        color,
        size,
        image: {
            imageId,
            imagePath: `${PATHS.ENDPOINT}/${PATHS.VARIANTS_STORAGE_PATH}/${productDirectory}/${imagePath}`,
            altText,
        },
        inventory,
    };
    return formattedProductVariant;
};

module.exports = formatProductVariant;
