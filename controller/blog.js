let {CreateBlog,UpdateBlog,deleteBlog,viewBlog}=require("../model/blog")

async function blogCreate(request,response){
    let done = await CreateBlog(request.body, request.userData).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).send(done.data)
}
async function blogupdate(request,response){
    let done = await UpdateBlog(request.body, request.userData).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).send(done.data)
}
async function blogview(request,response){
    let done = await viewBlog(request.body).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).send(done.data)
}
async function blogdelete(request,response){
    let done = await deleteBlog(request.body, request.userData).catch((err)=>{
        return { error: err}
    })
    if(!done || done.error){
        return response.status(done.status).send(done.error)
    }
    return response.status(done.status).send(done.data)
}

module.exports ={
    blogCreate,
    blogupdate,
    blogdelete,
    blogview
}