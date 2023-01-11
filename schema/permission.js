let { sequelize, DataTypes, Model, Op } = require("../init/dbconfig")

class Permission extends Model { }


Permission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    permission: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: "Role",
    tableName: "role",
    sequelize,
    createdAt: false,
    updatedAt: false
})


module.exports = { Permission, Op }