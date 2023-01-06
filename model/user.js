let { User, Op } = require("../schema/user")
let joi = require("joi");
let { transporter } = require("../helper.js/nodemailer")
let otp = require("otp-generator");
let bcrypt = require("bcrypt");
const { ref } = require("joi");
let jwt = require("jsonwebtoken")
let { joiValidation } = require("../helper.js/joi")


//Basic features

function registerJoi(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(2).required(),
        email_id: joi.string().email().max(30).min(5).required(),
        password: joi.string().min(3).max(10).required(),
        confirm_password: joi.string().min(3).max(10).valid(ref("password")).required(),
        mobile_number: joi.number().min(10).required()
    }).options({ abortEarly: false })
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

async function RegisterUser(param) {
    console.log(param)
    let check = registerJoi(param)
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await User.findOne({ where: { email_id: param.email_id }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (find) {
        return { status: 406, error: "This email id is already registered please try with other" }
    }
    let add = await User.create({
        name: param.name,
        email_id: param.email_id,
        mobile_number: param.mobile_number,
        password: await bcrypt.hash(param.password, 10)
    }).catch((err) => {
        return { error: err }
    })
    console.log(add)
    if (!add || add.error) {
        return { status: 500, error: "Please try again later" }
    }
    return { status: 200, data: "Registered successfully please validate your self" }

}

async function vericationMailJoi(param) {
    let schema = joi.object({
        email_id: joi.string().email().max(30).min(5).required(),
    }).options({ abortEarly: false })
    let check = schema.validateAsync(param)
    if (!check || check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function SendMail(param) {
    let check = await vericationMailJoi(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await User.findOne({ where: { email_id: param.email_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { status: 401, error: "You have to registered first" }
    }
    if (find && find.is_varified == true) {
        return { status: 200, error: "You are already verified" }
    }
    let code = otp.generate(6, { digits: true })

    let update = await User.update({ otp: code }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { status: 500, error: "Internal Server Error" }
    }
    let mailoption = {
        from: "mohif.waghu@somaiya.edu",
        to: find.email_id,
        subject: "verification mail",
        text: "Please use this varification code: " + code
    }

    let mail = await transporter.sendMail(mailoption).catch((err) => {
        return { error: err }
    })
    if (!mail || mail.error) {
        return { status: 406, error: "Please enter valid email id" }
    }
    return { status: 200, data: `varification mail send to your email id:${param.email_id}` }

}



function verifyJoi(param) {
    let schema = joi.object({
        email_id: joi.string().email().max(30).min(5).required(),
        verification_code: joi.string().min(3).required()
    }).options({ abortEarly: false })
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

async function verifyEmail(param) {
    let check = verifyJoi(param)
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await User.findOne({ where: { email_id: param.email_id }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { status: 406, error: "Cant find this email_id" }
    }
    if (find.otp != param.verification_code) {
        return { status: 406, error: "Verification code is incorrect" }
    }
    let update = await User.update({ is_varified: true, otp: "" }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { status: 500, error: "Internal Server Error" }
    }
    return { status: 200, data: " You are now varified now you can login" }
}


function loginJoi(param) {
    let schema = joi.object({
        email_id: joi.string().email().max(30).min(5).required(),
        password: joi.string().min(3).required()
    }).options({ abortEarly: false })
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

async function loginUser(param) {
    let check = loginJoi(param)
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await User.findOne({ where: { email_id: param.email_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { status: 406, error: "This email is not registered" }
    }
    if (find.is_varified != true) {
        return { status: 403, error: "Please verified first then login" }
    }
    let compare = await bcrypt.compare(param.password, find.password).catch((err) => {
        return { error: err }
    })
    if (!compare || compare.error) {
        return { status: 406, error: "username & password is not valid" }
    }
    let assign_token = jwt.sign(find.id, "mohif9232")
    if (!assign_token) {
        return { status: 500, error: "Internal server error" }
    }
    return { data: "Your are login successfully", token: assign_token }
}

async function forgetPassword(param) {
    let check = await joiValidation({
        email_id: joi.string().email().max(30).min(5).required()
    }, param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await User.findOne({ where: { email_id: param.email_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { status: 203, error: "You are not registered" }
    }
    if (find.is_varified == 0) {
        return { status: 401, error: "You are not verified" }
    }
    let code = otp.generate(5)
    let add = await User.update({ otp: code }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!add || add.error) {
        return { status: 500, error: "Internal Server Error" }
    }
    let mailoption = {
        from: "mohif.waghu@somaiya.edu",
        to: find.email_id,
        subject: "Forget Password Verification Mail",
        text: `Please use this one time password ${code} to reset your password`
    }
    let sendMail = await transporter.sendMail(mailoption).catch((err) => {
        return { error: err }
    })
    if (sendMail.rejected && sendMail.rejected.length > 0) {
        return { status: 203, error: "Please provide valid email id" }
    }
    if (!sendMail || sendMail.error) {
        return { status: 500, error: "Internal Server Error" }
    }
    return { status: 200, data: `Verification code is send to your registered email_id: ${find.email_id}` }
}

async function resetPassword(param) {
    let check = await joiValidation({
        verification_code: joi.string().max(5).min(5).required(),
        new_password: joi.string().min(5).max(15).required()
    }).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { status: 406, error: check.error }
    }
    let find = await User.findOne({ where: { otp: param.verification_code }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (!find || (find && find.error)) {
        return { status: 406, error: "Verification code is not valid" }
    }
    let reset = await User.update({ password: await bcrypt.hash(param.new_password, 10) }, {
        where: {
            id: find.id
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!reset || reset.error) {
        return { status: 500, error: "Internal Server Error" }
    }
    let empty = await User.update({ otp: "" }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!empty || (empty && empty.error)) {
        return { status: 500, error: "Internal Server Error" }
    }
    return { status: 200, data: " Your password reset successfullyy... You can login now" }
}
module.exports = { RegisterUser, SendMail, verifyEmail, loginUser, forgetPassword, resetPassword }