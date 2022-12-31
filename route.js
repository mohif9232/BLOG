let express=require("express");
let route = express()
let {blogCreate,blogdelete,blogupdate,blogview}=require("./controller/blog")




route.post("api/v1/createBlog", blogCreate);
route.put("api/v1/updateBlog", blogupdate);

route.get("api/v1/viewBlog", blogview);
route.put("api/v1/deleteBlog", blogdelete);

module.exports = route

