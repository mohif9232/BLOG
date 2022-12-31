let { Blog, Op } = require("../schema/blog")
let joi = require("joi");
const { and, where } = require("sequelize");

function createJoi(param) {
    let schema = joi.object({
        heading: joi.string().max(30).min(2).required(),
        content: joi.string().max(250).min(10).required()
    })
    let check = schema.validate(param)
    if (!check || check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function CreateBlog(param, userData) {
    let check = createJoi(param)
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await Blog.findAll({ where: { user_id: userData.id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error || find.length <= 5) {
        return { status: 406, error: "No more blogs you can add" }
    }
    let create = await Blog.create({
        heading: param.heading,
        content: param.content,
        user_id: userData.id
    }).catch((err) => {
        return { error: err }
    })
    if (!create || create.error) {
        return { status: 500, error: "Internal Server Error" }
    }
    return { status: 200, data: "Blog created successfullyy.." }

}


function updateJoi(param) {
    let schema = joi.object({
        id: joi.number().min(1).required(),
        heading: joi.string().max(30).min(2),
        content: joi.string().max(250).min(10)
    })
    let check = schema.validate(param)
    if (!check || check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function UpdateBlog(param, userData) {
    let check = updateJoi(param)
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await Blog.findOne({ where: { id: param.id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { status: 203, error: "Please provide proper id" }
    }
    let update = await Blog.update({
        heading: param.heading,
        content: param.content,
        updatedBy: userData.id
    }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { status: 500, error: "Something went wrong" }
    }
    return { status: 200, data: "Updated Successfullyy..." }
}

function viewJoi(param) {
    let schema = joi.object({
        id: joi.number().min(1),
        user_id: joi.number().min(1)
    })
    let check = schema.validate(param)
    if (!check || check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}
async function viewBlog(param) {
    let check = viewJoi(param)
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let query = {};
    if (param.id) {
        query = { id: param.id }
    }
    if (param.user_id) {
        query = { user_id: param.user_id }
    }
    let get = await Blog.findAll({ where: query, is_deleted: { [Op.ne]: true }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (!get || get.error) {
        return { status: 500, error: " something went wrong" }
    }
    return { status: 200, data: get }
}


function deleteJoi(param) {
    let schema = joi.object({
        id: joi.number().min(1).required()
    })
    let check = schema.validate(param)
    if (!check || check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function deleteBlog(param,userData) {
    let check = deleteJoi(param)
    if (!check || check.error) {
        return { status: 406, error: "provide proper id" }
    }
    let find= await Blog.findOne({where:{
        id:param.id,
        user_id:userData.id
    }}).catch((err)=>{
        return { error: err}
    })
    if(!find || find.error){
        return { status : 501 , error:"Information is not correct"}
    }
    let change = await Blog.update({is_deleted:true},{where:{id:find.id}}).catch((err)=>{
        return { error: err}
    })
    if(!change || change.error){
        return { status: 500 , error:"Internal Server error"}
    }
    return { status: 200 , data : "blog deleted successfullyyy"}
}

module.exports={CreateBlog, UpdateBlog , deleteBlog , viewBlog}
