'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Variant, { foreignKey: 'sizeID' });
        }
    }
    Size.init(
        {
            sizeID: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                allowNull: false,
                type: DataTypes.ENUM,
                values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            },
        },
        {
            sequelize,
            modelName: 'Size',
        }
    );
    return Size;
};
