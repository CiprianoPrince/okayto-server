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
            this.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Profile.init(
        {
            profileId: {
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
            role: {
                allowNull: false,
                type: DataTypes.ENUM,
                values: ['Admin', 'User', 'Guest'],
            },
        },
        {
            sequelize,
            modelName: 'Profile',
        }
    );
    return Profile;
};
