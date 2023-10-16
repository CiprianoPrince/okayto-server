'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Cart, { foreignKey: 'cartId' });
            this.belongsTo(models.Variant, { foreignKey: 'variantId' });
        }
    }
    CartDetail.init(
        {
            cartDetailId: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            cartId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'carts',
                    key: 'cartId',
                },
            },
            variantId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'variants',
                    key: 'variantId',
                },
            },
            quantity: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'CartDetail',
        }
    );
    return CartDetail;
};
