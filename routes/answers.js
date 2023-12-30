var express = require('express');
var router = express.Router();
const myConnection = require("../helper/db.js")
router.get('/:answers_id',   async function(req, res, next) {
  const answers_id=req.params.answers_id;
  const query=`select * from answers where answer_id=${answers_id}`
  const data= await myConnection(query)
  res.send(data);
});
router.get('/',   async function(req, res, next) {
  const query="select * from answers;";
  const data= await myConnection(query)
  res.send(data);
});
router.post("/", async function (req, res, next) {
    const { user_id,survey_id,question_id,answer_text} = req.body;
    const query = `insert into answers (user_id,survey_id,question_id,answer_text) values (${user_id},${survey_id},${question_id},"${answer_text}")`;
    const data =await myConnection(query);
    res.send(data);
  });
  
  router.delete("/:answer_id",async function(req,res,next){
      const answer_id=req.params.answer_id;
      
      const query=`DELETE FROM answers WHERE answer_id =${answer_id}`
      const data =await myConnection(query);
      res.json(data);
  
  })
  router.get('/user/:user_id/survey/:survey_id/question/:question_id',  async function(req, res, next) {
    const user_id=req.params.user_id;
    const survey_id=req.params.survey_id;
    const question_id=req.params.question_id;
    const query=`SELECT answer_text FROM answers WHERE user_id = ${user_id} AND survey_id = ${survey_id} AND question_id = ${question_id};`;
    const data= await myConnection(query)
    res.send(data);
  });
module.exports = router;
