let mail = require("nodemailer")

let transporter = mail.createTransport({
    service: "gmail",
    auth: {
        user: "mohif.waghu@somaiya.edu",
        pass: "jipbczhcaefrlmhn"
    },
    tls: {
        rejectUnauthorized: true
    }
})


module.exports = { transporter } 