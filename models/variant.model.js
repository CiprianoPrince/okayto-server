'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Variant extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.ProductColor, { foreignKey: 'productColorId' });
            this.belongsTo(models.Size, { foreignKey: 'sizeId' });
            this.hasOne(models.Inventory, { foreignKey: 'variantId' });
        }
    }
    Variant.init(
        {
            variantId: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            productColorId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'productcolors',
                    key: 'productColorId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            sizeId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'sizes',
                    key: 'sizeId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'Variant',
            hooks: {
                beforeCreate: async (variant, options) => {
                    const { sequelize } = variant;
                    // Accessing extra data from options
                    const productColorData = options.extraData.productColor;
                    const imageData = options.extraData.image;

                    // Create associated ProductColor
                    const createdProductColor = await sequelize.models.ProductColor.create(
                        {
                            productId: productColorData.productId,
                            colorId: productColorData.colorId,
                        },
                        {
                            extraData: {
                                image: { ...imageData },
                            },
                        }
                    );

                    // Set the productColorId for the variant being created
                    variant.productColorId = createdProductColor.productColorId;
                },
                afterCreate: async (variant, options) => {
                    const { sequelize } = variant;

                    // Accessing extra data from options
                    const inventoryData = options.extraData.color;

                    // Create associated Image
                    await sequelize.models.Inventory.create({
                        variantId: variant.variantId,
                        quantityInStock: inventoryData.quantityInStock,
                        reOrderThreshold: inventoryData.reOrderThreshold,
                        lastRestockDate: inventoryData.lastRestockDate,
                    });
                },
            },
        }
    );
    return Variant;
};
