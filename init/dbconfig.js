let {Sequelize, Model , DataTypes , QueryTypes ,Op}=require("sequelize")

let sequelize= new Sequelize("mysql://root:@localhost/blog_management")

sequelize.authenticate().then(()=>{
    console.log("Connected to Databse")
}).catch((err)=>{
    console.log("Unable to connect", err)
})


module.exports ={
    sequelize, Model, DataTypes , QueryTypes , Op
}