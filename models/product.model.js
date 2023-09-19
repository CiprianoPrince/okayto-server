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
            this.belongsTo(models.Category, { foreignKey: 'categoryID' });
            this.hasMany(models.ProductColor, { foreignKey: 'productID' });
        }
    }
    Product.init(
        {
            productID: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            categoryID: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'categories',
                    key: 'categoryID',
                },
            },
            name: {
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
        }
    );
    return Product;
};
