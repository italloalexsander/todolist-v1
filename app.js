const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {

  var today = new Date();
  var currentDay = today.getDay();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  res.render('list', {day: days[currentDay]});

});

app.listen(3000, (req, res)=>{
  console.log("Server started on port 3000");
});