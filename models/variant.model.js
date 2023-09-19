'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Variant extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.ProductColor, { foreignKey: 'productColorID' });
            this.belongsTo(models.Size, { foreignKey: 'sizeID' });
            this.hasOne(models.Inventory, { foreignKey: 'variantID' });
        }
    }
    Variant.init(
        {
            variantID: {
                primaryKey: true,
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            productColorID: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'productcolors',
                    key: 'productColorID',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            sizeID: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'sizes',
                    key: 'sizeID',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'Variant',
        }
    );
    return Variant;
};
