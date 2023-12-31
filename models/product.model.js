'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
            this.hasOne(models.ProductImage, { foreignKey: 'productId', as: 'image' });
            this.hasMany(models.ProductColor, { foreignKey: 'productId' });
        }
    }
    Product.init(
        {
            productId: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            categoryId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'categories',
                    key: 'categoryId',
                },
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            slug: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            description: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            price: {
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
            },
        },
        {
            sequelize,
            modelName: 'Product',
            hooks: {
                afterCreate: async (product, options) => {
                    const { sequelize } = product;

                    const imageData = options.extraData?.image;

                    await sequelize.models.ProductImage.create({
                        productId: product.productId,
                        ...imageData,
                    });
                },
            },
        }
    );
    return Product;
};
