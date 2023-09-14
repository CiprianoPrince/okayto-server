'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {
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
    Profile.init(
        {
            profileID: {
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
            role: {
                allowNull: false,
                type: DataTypes.ENUM,
                values: ['Admin', 'User'],
            },
        },
        {
            sequelize,
            modelName: 'Profile',
        }
    );
    return Profile;
};
