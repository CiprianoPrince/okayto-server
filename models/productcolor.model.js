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
            this.belongsTo(models.Product, { foreignKey: 'productID' });
            this.belongsTo(models.Color, { foreignKey: 'colorID' });
        }
    }
    ProductColor.init(
        {
            productColorID: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            productID: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'products',
                    key: 'productID',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            colorID: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'colors',
                    key: 'colorID',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'ProductColor',
        }
    );
    return ProductColor;
};
