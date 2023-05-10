const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

// import the Todo model from the other file
const Todo = require("./models/todo");

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("debug", true);
mongoose.Promise = Promise;

app.use(bodyParser.json());

function success(res, payload) {
  return res.status(200).json(payload);
}

app.get("/", async (req, res) => {
  res.send('hello there');
})

app.get("/todos", async (req, res, next) => {
  try {
    // use the Todo model to retrieve all todos from the database
    const todos = await Todo.find({});
    return success(res, todos);
  } catch (err) {
    next({ status: 400, message: "failed to get todos" });
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);
    return success(res, todo);
  } catch (err) {
    next({ status: 400, message: "failed to create todo" });
  }
});

app.put("/todos/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return success(res, todo);
  } catch (err) {
    next({ status: 400, message: "failed to update todo" });
  }
});

app.delete("/todos/:id", async (req, res, next) => {
  try {
    await Todo.findByIdAndRemove(req.params.id);
    return success(res, "todo deleted!");
  } catch (err) {
    next({ status: 400, message: "failed to delete todo" });
  }
});

app.get("/todos/pending", async (req, res, next) => {
  try {
    const pendingTodos = await Todo.find({ completed: false });
    return success(res, pendingTodos);
  } catch (err) {
    next({ status: 400, message: "failed to get pending todos" });
  }
});

app.get("/todos/completed", async (req, res, next) => {
  try {
    const completedTodos = await Todo.find({ completed: true });
    return success(res, completedTodos);
  } catch (err) {
    next({ status: 400, message: "failed to get completed todos" });
  }
});

app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.status || 400,
    message: err.message || "there was an error processing request",
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
