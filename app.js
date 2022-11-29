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
const currentDay = date.getDay("en-US");

app.get("/", (req, res) => {
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
  const listName = req.body.list;

  console.log(listName);

  const newItem = new Task({
    name: itemName
  })
  if(listName === currentDay){
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, result) => {
      if(!err){
        if(result){
          result.tasks.push(newItem);
          result.save();
          res.redirect("/" + result.name);
        }
      }
    })
  }
  
}
)

app.post("/delete", (req, res) => {
  const checkedItemid = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === currentDay){
    Task.findByIdAndRemove(checkedItemid, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log("deleted item: " + checkedItemid);
        res.redirect("/");
      }
    })
  } else {
    List.findOneAndUpdate({name: listName}, 
      {$pull: {tasks: {_id: checkedItemid}}}, 
      (err, result)=>{
        if(!err){
          res.redirect("/" + listName);
        }
      })
    }
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