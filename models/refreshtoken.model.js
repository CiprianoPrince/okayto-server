'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RefreshToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: 'userID' });
        }
    }
    RefreshToken.init(
        {
            refreshTokenID: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userID: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'users',
                    key: 'userID',
                },
            },
            token: {
                allowNull: true,
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'RefreshToken',
        }
    );
    return RefreshToken;
};
