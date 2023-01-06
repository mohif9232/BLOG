let { sequelize, DataTypes, Model } = require("../init/dbconfig")

class User_Role extends Model { }


User_Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "Role",
    tableName: "role",
    sequelize
})


module.exports = { User_Role }