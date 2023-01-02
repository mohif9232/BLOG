let {sequelize,Model,DataTypes,QueryTypes,Op}=require("../init/dbconfig")
class User extends Model {}
User.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true
        }
    },
    mobile_number:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:true
    },
    otp:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    is_varified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    modelName:"User",
    tableName:"user",
    sequelize
})

module.exports ={User ,Op}