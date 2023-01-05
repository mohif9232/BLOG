let joi = require("joi")

async function joiValidation(data, param) {
    let schema = joi.object(data).options({ abortEarly: false })
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

module.exports = { joiValidation }