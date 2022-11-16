const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {

  var today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  var currentDay = today.toLocaleDateString("en-US", options);

  res.render('list', {day: currentDay});

});

app.listen(3000, (req, res)=>{
  console.log("Server started on port 3000");
});