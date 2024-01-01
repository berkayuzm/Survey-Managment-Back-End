var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");

const myConnection = require("../helper/db.js")
//GET QUESTION BY ID
router.get('/:question_id',   async function(req, res, next) {
  const question_id=req.params.question_id;
  const query=`select * from questions where question_id=${question_id}`
  const data= await myConnection(query)
  res.send(data);
});

//GET ALL QUESTIONS

router.get('/',   async function(req, res, next) {
  const query="select * from questions;";
  const data= await myConnection(query)
  res.send(data);
});

//ADD QUESTION 

router.post("/",[
  body("text")
    .isLength({ min: 5 })
    .withMessage("Soru en az 5 karakter olmalıdır."),
], async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    const { survey_id,text} = req.body;
    const query = `insert into questions (survey_id,text) values (${survey_id},"${text}")`;
    const data =await myConnection(query);
    const insertedData = { id: data.insertId, survey_id, text };
      res.status(201).json({ message: 'Veri başarıyla eklendi.', data: insertedData });
  })

  //DELETE QUESTION
  
  router.delete("/:question_id",async function(req,res,next){
      const question_id=req.params.question_id;
      
      const query=`DELETE FROM questions WHERE question_id =${question_id}`
      const data =await myConnection(query);
      res.json(data);
  
  })

// UPDATE QUESTIONS

  router.put(
    "/:question_id",
    [
      body().custom((value, { req }) => {
        const updatedFields = req.body;
        for (const field in updatedFields) {
          if (field === "text" && updatedFields[field].length < 10) {
            throw new Error("soru en az 10 karakter olmalıdır.");
          }
          
        }
        return true;
      }),
    ],
    async function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const question_id = req.params.question_id;
      const updateFields = req.body; // İsteğin içinden gelen güncellenmesi istenen sütunlar ve değerleri
      let updateQuery = "UPDATE questions SET ";
      const updateColumns = Object.keys(updateFields);
      updateColumns.forEach((column, index) => {
        if (column !== "token") {
          updateQuery += `${column} = "${updateFields[column]}"`;
          if (index < updateColumns.length - 2) {
            updateQuery += ", ";
          }
        }
      });
  
      updateQuery += ` WHERE question_id = ${question_id}`;
      const data = await myConnection(updateQuery);
  
      res.json(data);
    });
    //Get choices by question id
    router.get("/:question_id/options", async function (req, res, next) {
      const question_id = req.params.question_id;
      const query = `select * from options where question_id=${question_id}`;
      const data = await myConnection(query);
      res.send(data);
    })

module.exports = router;
