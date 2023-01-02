let express=require("express");
let app = express()
let {register, verify , login}=require("./controller/user")




app.post("/api/v1/register",register)
app.post("/api/v1/verify_email",verify)
app.post("/api/v1/login",login)



module.exports = app

