const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", (req, res) => {

  let today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  let currentDay = today.toLocaleDateString("en-US", options);

  res.render('list', { listName: currentDay, newItems: items });

});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  
  if(req.body.button === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  } 
})

app.get("/work", (req, res) => {
  res.render('list', { listName: "Work", newItems: workItems });
})

app.get("/about", (req, res) =>{
  res.render('about')
})

app.listen(3000, (req, res) => {
  console.log("Server started on port 3000");
});