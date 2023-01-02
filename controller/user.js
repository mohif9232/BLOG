let {RegisterUser , verifyEmail , loginUser}=require("../model/user")

async function register(request,response){
    let done = await RegisterUser(request.body).catch((err)=>{
        return { error: err}
    })
    console.log(done)
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).send(done.data)
}

async function verify(request,response){
    let done = await verifyEmail(request.body).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).send(done.data)
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
    verify,
    login
}