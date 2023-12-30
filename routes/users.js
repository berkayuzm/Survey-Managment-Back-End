var express = require('express');
var router = express.Router();
const myConnection = require("../helper/db.js")
//Get by ID
router.get('/:user_id',   async function(req, res, next) {
  const user_id=req.params.user_id;
  const query=`select * from users where user_id=${user_id}`
  const data= await myConnection(query)
  res.send(data);
});
//Get List
router.get('/',   async function(req, res, next) {
  const query="select * from users;";
  const data= await myConnection(query)
  res.send(data);
});


module.exports = router;
