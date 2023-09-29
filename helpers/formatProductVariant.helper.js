const formatProductVariant = (foundProductVariant) => {
    const {
        variantId,
        Size: size,
        Inventory: inventory,
        ProductColor: { Color: color, VariantImage: image },
    } = foundProductVariant;

    const formattedProductVariant = { variantId, color, size, image, inventory };
    return formattedProductVariant;
};

module.exports = formatProductVariant;
