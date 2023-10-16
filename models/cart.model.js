'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: 'userId' });
            this.hasOne(models.CartDetail, { foreignKey: 'cartId' });
        }
    }
    Cart.init(
        {
            cartId: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'users',
                    key: 'userId',
                },
            },
        },
        {
            sequelize,
            modelName: 'Cart',
            hooks: {
                afterCreate: async (cart, options) => {
                    const { sequelize } = cart;

                    // Accessing extra data from options
                    const cartDetailsData = options.extraData.cartDetailsData;

                    // Create associated Image
                    await sequelize.models.CartDetail.create({
                        ...cartDetailsData,
                        cartId: cart.cartId,
                    });
                },
            },
        }
    );
    return Cart;
};
