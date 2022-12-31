let {sequelize,Model,DataTypes,QueryTypes,Op}=require("../init/dbconfig")
class Blog extends Model {}
Blog.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    heading :{
        type:DataTypes.STRING,
        allowNull:false
    },
    content:{
        type:DataTypes,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    is_deleted:{
        type:DataTypes.INTEGER,
        defaultValue:false
    }
},{
    modelName:"Blog",
    tableName:"blog",
    sequelize
})

module.exports ={Blog ,Op}