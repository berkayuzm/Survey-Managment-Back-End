var express = require('express');
var router = express.Router();
const myConnection = require("../helper/db.js")
router.get('/:options_id',   async function(req, res, next) {
  const options_id=req.params.options_id;
  const query=`select * from options where options_id=${options_id}`
  const data= await myConnection(query)
  res.send(data);
});
router.get('/',   async function(req, res, next) {
  const query="select * from options;";
  const data= await myConnection(query)
  res.send(data);
});
router.post("/", async function (req, res, next) {
    const { survey_id,question_id,options_text} = req.body;
    const query = `insert into options (survey_id,question_id,options_text) values (${survey_id},${question_id},"${options_text}")`;
    const data =await myConnection(query);
    const insertedData = { id: data.insertId, survey_id, question_id,options_text };
      res.status(201).json({ message: 'Veri başarıyla eklendi.', data: insertedData });
  });
  
  router.delete("/:options_id",async function(req,res,next){
      const options_id=req.params.options_id;
      
      const query=`DELETE FROM options WHERE options_id =${options_id}`
      const data =await myConnection(query);
      res.json(data);
  
  })
  router.put("/:options_id",async function(req,res,next){
    const options_id = req.params.options_id;
    const updateFields = req.body; // İsteğin içinden gelen güncellenmesi istenen sütunlar ve değerleri
    let updateQuery = "UPDATE options SET ";
    const updateColumns = Object.keys(updateFields);
    updateColumns.forEach((column, index) => {
      if (column !== "token") {
        updateQuery += `${column} = "${updateFields[column]}"`;
        if (index < updateColumns.length - 1) {
          updateQuery += ", ";
        }
      }
    });

    updateQuery += ` WHERE options_id = ${options_id}`;
    const data = await myConnection(updateQuery);
    res.json(data);

})

module.exports = router;