
let express = require("express")
const  route  = require("./route")

let app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('view engine','ejs')

app.use("/",route)


app.listen(3001,()=>{
    console.warn(`Connected to server `)
})