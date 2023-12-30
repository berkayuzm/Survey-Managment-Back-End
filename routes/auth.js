var express = require('express');
var router = express.Router();
const myConnection = require("../helper/db.js")
const jwt=require("jsonwebtoken")
router.post("/authenticate",async function(req,res){
    const {username,password}=req.body;
    const query=`select * from users where username= "${username}" and password = "${password}"`
    const data =  myConnection(query);
    data.then((respond)=>{
       if(respond.length>0){
        //kullanıcı bulundu
        console.log(respond)
        const payload={
            username:respond[0].username,
            roles:respond[0].roles,
            user_id:respond[0].user_id
        };
        const token=jwt.sign(payload,req.app.get("api_secret_key"),{expiresIn:60000})
        res.send({"status":true,"msg":"Giriş başarılı",token})
       }
       else{
        res.statusCode=401;
        res.send({"status":false,"msg":"Böyle bir kullanıcı yok!"})
       }
    }).catch((err)=>{
        console.log(err)
        res.send({"error":err})
    })
})
module.exports = router;
