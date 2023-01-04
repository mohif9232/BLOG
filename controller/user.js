let {RegisterUser , SendMail,verifyEmail , loginUser}=require("../model/user")

async function register(request,response){
    let done = await RegisterUser(request.body).catch((err)=>{
        return { error: err}
    })
    console.log(done)
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).redirect("../v1/send_mail")
}

async function mail(request,response){
    let done = await SendMail(request.body).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).redirect("../v1/verify_email")
}

async function verify(request,response){
    let done = await verifyEmail(request.body).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).redirect("../v1/login")
}

async function login(request,response){
    let done = await loginUser(request.body).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(200).send(done)
}

module.exports ={
    register,
    mail,
    verify,
    login
}