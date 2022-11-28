const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost.com:27017/todoListDB");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const taskSchema = {
  name: String
}

const Task = mongoose.model("task", taskSchema);

const orderFood = new Task({
  name: "Order food"
})

const eatFood = new Task({
  name: "Eat food"
})

const cleanPlates = new Task({
  name: "Clean Plates"
})

Task.insertMany([orderFood, eatFood, cleanPlates], (err)=>{
  if(err){
    console.log(err)
  }else{
    console.log("All items were inserted");
  }
})

app.get("/", (req, res) => {

  const currentDay = date.getDay("en-US");

  res.render('list', { listName: currentDay, newItems: items });

});

app.post("/", (req, res) => {
  const item = req.body.newItem;

  if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
})

app.get("/work", (req, res) => {
  res.render('list', { listName: "Work", newItems: workItems });
})

app.get("/about", (req, res) => {
  res.render('about')
})

app.listen(3000, (req, res) => {
  console.log("Server started on port 3000");
});