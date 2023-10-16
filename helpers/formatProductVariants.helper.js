const formatFoundProductVariants = (foundProductVariants) => {
    const formattedProductVariants = foundProductVariants.ProductColors.map((productColor) => {
        return productColor.Variants.map((variant) => {
            return {
                variantId: variant.variantId,
                productId: productColor.productId,
                categoryId: productColor.Product.categoryId,
                name: productColor.Product.name,
                price: productColor.Product.price,
                slug: productColor.Product.slug,
                color: {
                    colorId: productColor.Color.colorId,
                    name: productColor.Color.name,
                    code: productColor.Color.code,
                },
                size: {
                    sizeId: variant.Size.sizeId,
                    name: variant.Size.name,
                },
                image: {
                    imageId: productColor.VariantImage.variantImageId,
                    imagePath: productColor.VariantImage.imagePath,
                    altText: productColor.VariantImage.altText,
                },
                inventory: {
                    inventoryId: variant.Inventory.inventoryId,
                    quantityInStock: variant.Inventory.quantityInStock,
                    reOrderThreshold: variant.Inventory.reOrderThreshold,
                    lastRestockDate: variant.Inventory.lastRestockDate,
                },
            };
        });
    }).flat();

    return formattedProductVariants;
};

module.exports = formatFoundProductVariants;
