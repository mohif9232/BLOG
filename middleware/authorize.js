let { sequelize, QueryTypes } = require("../init/dbconnect")
let jwt = require("jsonwebtoken")

function auth(permission) {
    return async function (request, response, next) {
        if (!request.headers || !request.headers.token) {
            return response.status(401).send("Token NOT FOUND")
        }
        let verify = '';
        try {
            verify = jwt.verify(request.headers.token, 'mohif9232')
        } catch (error) {
            if (!verify || verify.error) {
                return response.status(402).send("Token Invalid")
            }
        }

        let user = await sequelize.query(`SELECT user.name , role.roles , permission.permission FROM user LEFT JOIN user_role ON user_role.user_id = user.id LEFT JOIN role ON role.id = user_role.role_id LEFT JOIN role_permission ON role_permission.role_id = role.id LEFT JOIN permission ON permission.id = role_permission.permission_id WHERE user.id =:key`, {
            replacements: { key: verify.id },
            type: QueryTypes.SELECT
        }).catch((err) => {
            return { error: err }
        });

        if (!user || (user && user.error)) {
            return response.status(401).send({ error: "User Not Found" })
        }
        let userpermission = {};
        for (let data of user) {
            userpermission[data.permission] = 1
        }

        if ((permission || !permission) && !userpermission[permission]) {
            return response.status(401).send("Access denied")
        }

        request.userData = { id: verify.id, name: user[0].name, permission: userpermission }

        next();
    }

}

module.exports = { auth }