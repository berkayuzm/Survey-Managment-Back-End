var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var usersRouter = require('./routes/users');
var questionsRouter=require("./routes/questions")
var surveysRouter=require("./routes/surveys")
var answersRouter=require("./routes/answers")
var authRouter=require("./routes/auth")
var optionsRouter=require("./routes/options")
var completedSurveys=require("./routes/completedSurveys")
var app = express();
//Config dosyası.
var config=require("./config");
app.set("api_secret_key",config.api_secret_key);
//Middleware
const verifyToken=require("./middleware/verify-token")
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/",authRouter);
app.use("/api",verifyToken)
app.use('/api/users', usersRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/surveys', surveysRouter);
app.use('/api/answers', answersRouter);
app.use("/api/options",optionsRouter)
app.use("/api/completedsurveys",completedSurveys)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
