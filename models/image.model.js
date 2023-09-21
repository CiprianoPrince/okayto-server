'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.ProductColor, { foreignKey: 'productColorId' });
        }
    }
    Image.init(
        {
            imageId: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            productColorId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'productcolors',
                    key: 'productColorId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            imagePath: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            altText: {
                allowNull: true,
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'Image',
        }
    );
    return Image;
};
