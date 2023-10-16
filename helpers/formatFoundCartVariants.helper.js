// const formatFoundCartVariants = (foundCartVariants) => {
//     const foundCartVariantsCopy = [...foundCartVariants];
//     const formattedFoundCartVariantsCopy = foundCartVariantsCopy.map((foundCartVariant) => ({
//         cartId: foundCartVariant.cartId,
//         quantity: foundCartVariant.CartDetail.quantity,
//         createdAt: foundCartVariant.createdAt,
//         variant: {
//             variantId: foundCartVariant.CartDetail.Variant.variantId,
//             productId: foundCartVariant.CartDetail.Variant.ProductColor.productId,
//             color: {
//                 colorId: foundCartVariant.CartDetail.Variant.ProductColor.Color.colorId,
//                 name: foundCartVariant.CartDetail.Variant.ProductColor.Color.name,
//                 code: foundCartVariant.CartDetail.Variant.ProductColor.Color.code,
//             },
//             image: {
//                 imageId:
//                     foundCartVariant.CartDetail.Variant.ProductColor.VariantImage.variantImageId,
//                 imagePath: foundCartVariant.CartDetail.Variant.ProductColor.VariantImage.imagePath,
//                 altText: foundCartVariant.CartDetail.Variant.ProductColor.VariantImage.altText,
//             },
//             size: {
//                 sizeId: foundCartVariant.CartDetail.Variant.Size.sizeId,
//                 name: foundCartVariant.CartDetail.Variant.Size.name,
//             },
//             inventory: {
//                 inventoryId: foundCartVariant.CartDetail.Variant.Inventory.inventoryId,
//                 quantityInStock: foundCartVariant.CartDetail.Variant.Inventory.quantityInStock,
//                 reOrderThreshold: foundCartVariant.CartDetail.Variant.Inventory.reOrderThreshold,
//                 lastRestockDate: foundCartVariant.CartDetail.Variant.Inventory.lastRestockDate,
//             },
//         },
//     }));
//     return formattedFoundCartVariantsCopy;
// };

// module.exports = formatFoundCartVariants;

const formatFoundCartVariants = (foundCartVariants) => {
    if (!foundCartVariants.length) return [];
    const foundCartVariantsCopy = [...foundCartVariants];
    const formattedFoundCartVariantsCopy = foundCartVariantsCopy.map((foundCartVariant) => ({
        cartId: foundCartVariant.cartId,
        quantity: foundCartVariant.CartDetail.quantity,
        variantId: foundCartVariant.CartDetail.Variant.variantId,
        productId: foundCartVariant.CartDetail.Variant.ProductColor.productId,
        createdAt: foundCartVariant.createdAt,
    }));
    return formattedFoundCartVariantsCopy;
};

module.exports = formatFoundCartVariants;
