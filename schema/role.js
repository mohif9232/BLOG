let { sequelize, DataTypes, Model } = require("../init/dbconfig")

class Role extends Model { }


Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    roles: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "Role",
    tableName: "role",
    sequelize
})


module.exports = { Role }