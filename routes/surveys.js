var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const myConnection = require("../helper/db.js");
//Get By ID
router.get("/:survey_id", async function (req, res, next) {
  const survey_id = req.params.survey_id;
  const query = `select * from surveys where survey_id=${survey_id}`;
  const data = await myConnection(query);
  res.send(data);
});
//Get List
router.get("/", async function (req, res, next) {
  const query = "select * from surveys;";
  const data = await myConnection(query);
  if (data.length > 0) {
    res.send({ data: data, length: data.length });
  } else {
    res.send({ message: "herhangi bir veri bulunamadı." });
  }
});
// Add new survey..
router.post(
  "/",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Anket başlığı en az 5 karakter olmalıdır."),
    body("description")
      .isLength({ min: 20 })
      .withMessage("Anket açıklaması en az 20 karakter olmalıdır."),
  ],
  async function (req, res, next) {
    const { user_id, title, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const query = `insert into surveys (user_id,title,description) values (${user_id},"${title}","${description}")`;
      const data = await myConnection(query);
      const insertedData = { id: data.insertId, title, description };
      res.status(201).json({ message: 'Veri başarıyla eklendi.', data: insertedData });
    }
  }
);
// Delete survey
router.delete("/:survey_id", async function (req, res, next) {
  const survey_id = req.params.survey_id;
  const query = `DELETE FROM surveys WHERE survey_id =${survey_id}`;
  const data = await myConnection(query);
  res.json(data);
});

//Update survey
router.put(
  "/:survey_id",
  [
    body().custom((value, { req }) => {
      const updatedFields = req.body;
      for (const field in updatedFields) {
        if (field === "title" && updatedFields[field].length < 5) {
          throw new Error("title en az 5 karakter olmalıdır.");
        }
        if (field === "description" && updatedFields[field].length < 20) {
          throw new Error("description en az 20 karakter olmalıdır.");
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
    const survey_id = req.params.survey_id;
    const updateFields = req.body; // İsteğin içinden gelen güncellenmesi istenen sütunlar ve değerleri
    let updateQuery = "UPDATE surveys SET ";
    const updateColumns = Object.keys(updateFields);
    console.log(updateFields)
    updateColumns.forEach((column, index) => {
      if (column !== "token") {
        updateQuery += `${column} = "${updateFields[column]}"`;
        if (index < updateColumns.length - 1) {
          updateQuery += ", ";
        }
      }
    });

    updateQuery += ` WHERE survey_id = ${survey_id}`;
    const data = await myConnection(updateQuery);

    res.json(data);
  }

  
  );
  //Get questions by survey_id
  router.get("/:survey_id/questions", async function (req, res, next) {
    const survey_id = req.params.survey_id;
    const query = `select * from questions where survey_id=${survey_id}`;
    const data = await myConnection(query);
    res.send(data);
  })

module.exports = router;
