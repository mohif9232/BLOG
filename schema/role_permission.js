let { sequelize, DataTypes, Model } = require("../init/dbconfig")

class Role_Permission extends Model { }


Role_Permission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER,
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


module.exports = { Role_Permission }