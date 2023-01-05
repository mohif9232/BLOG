let express = require("express");
let app = express()
let { register, mail, verify, login, forget } = require("./controller/user")


app.post("/api/v1/register", register)
app.post("/api/v1/send_mail", mail)
app.post("/api/v1/verify_email", verify)
app.post("/api/v1/login", login)
app.post("/api/v1/forget_password", forget)


app.get("/api/v1/register", (request, response) => {
    response.render('register')
})
app.get("/api/v1/send_mail", (request, response) => {
    response.render('send_mail')
})
app.get("/api/v1/verify_email", (request, response) => {
    response.render('verify_email')
})
app.get("/api/v1/login", (request, response) => {
    response.render('login')
})



module.exports = app

