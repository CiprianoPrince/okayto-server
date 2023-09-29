'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductColor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Product, { foreignKey: 'productId' });
            this.belongsTo(models.Color, { foreignKey: 'colorId' });
            this.hasMany(models.Variant, { foreignKey: 'productColorId' });
            this.hasOne(models.VariantImage, { foreignKey: 'productColorId' });
        }
    }
    ProductColor.init(
        {
            productColorId: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            productId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'products',
                    key: 'productId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            colorId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'colors',
                    key: 'colorId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'ProductColor',
            hooks: {
                afterCreate: async (productColor, options) => {
                    const { sequelize } = productColor;

                    // Accessing extra data from options
                    const variantImageData = options.extraData.variantImageData;

                    // Create associated Image
                    await sequelize.models.VariantImage.create({
                        productColorId: productColor.productColorId,
                        imagePath: variantImageData.imagePath,
                        altText: variantImageData.altText,
                    });
                },
            },
        }
    );
    return ProductColor;
};
