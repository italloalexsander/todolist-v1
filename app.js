const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todoListDB");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const taskSchema = {
  name: String
}


const Task = mongoose.model("task", taskSchema);

const welcomeMessage = new Task({
  name: "Welcome to your ToDo List"
})

const plusMessage = new Task({
  name: "Hit + to add a task"
})

const completeMessage = new Task({
  name: "<- Select this to mark as complete"
})

const defaultTasks = [welcomeMessage, plusMessage, completeMessage];

const listSchema = {
  name: String,
  tasks: [taskSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {

  const currentDay = date.getDay("en-US");
  Task.find({}, (err, results) => {
    if (results.length === 0) {
      Task.insertMany(defaultTasks, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log("All items were inserted");
        }
      })
      res.redirect("/");
    }
    res.render('list', { listName: currentDay, newItems: results });

  })

});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;

  const newItem = new Task({
    name: itemName
  })

  /*if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {*/
  newItem.save();
  res.redirect("/");
}
)

app.post("/delete", (req, res) => {
  const checkedItemid = req.body.checkbox;
  Task.findByIdAndRemove(checkedItemid, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("deleted item: " + checkedItemid);
      res.redirect("/");
    }
  })
})

app.get("/:customList", (req, res) => {
  const customListName = req.params.customList;
  List.findOne({ name: customListName }, (err, result) => {
    if (!err) {
      if (!result) {
        //Create a new list
        const list = new List({
          name: customListName,
          tasks: defaultTasks
        })
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show existing list
        console.log(result);
        res.render('list', { listName: result.name, newItems: result.tasks })
      }
    } else {
      console.log(err);
    }
  })

})

app.get("/about", (req, res) => {
  res.render('about')
})

app.listen(3000, (req, res) => {
  console.log("Server started on port 3000");
});