var express = require('express');
var router = express.Router();
const myConnection = require("../helper/db.js")

router.get('/:completed_id',   async function(req, res, next) {
    const completed_id=req.params.completed_id;
    const query=`select * from CompletedSurveys where completed_id=${completed_id}`
    const data= await myConnection(query)
    res.send(data);
  });
  router.get('/',   async function(req, res, next) {
    const query="select * from CompletedSurveys;";
    const data= await myConnection(query)
    res.send(data);
  });
  router.post("/", async function (req, res, next) {
      const { user_id,survey_id} = req.body;
      const query = `insert into CompletedSurveys (user_id,survey_id) values (${user_id},${survey_id})`;
      const data =await myConnection(query);
      res.send(data);
    });
    
    router.delete("/:completed_id",async function(req,res,next){
        const completed_id=req.params.completed_id;
        const query=`DELETE FROM CompletedSurveys WHERE completed_id =${completed_id}`
        const data =await myConnection(query);
        res.json(data);
    })
    router.get('/user/:user_id',   async function(req, res, next) {
        const user_id=req.params.user_id;

        const query=`select surveys.survey_id,surveys.title,surveys.description from  CompletedSurveys JOIN surveys ON CompletedSurveys.survey_id = surveys.survey_id where CompletedSurveys.user_id=${user_id}`;
        const data= await myConnection(query)
        res.send(data);
      });
  module.exports = router;
  