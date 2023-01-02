let mail = require("nodemailer")

        let transporter = mail.createTransport({
            service: "gmail",
            auth: {
                user: "mohif.waghu@somaiya.edu",
                pass: "jipbczhcaefrlmhn"
            }
        })


module.exports = {transporter} 