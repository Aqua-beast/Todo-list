const express = require("express")
const app = express() // create express app
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 3000 // set port to listen on
const db = require("./models/") // import the Todo model from ./models
const path = require('path'); // import path module

// // set view engine to EJS
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(bodyParser.json()) // parse incoming request data as JSON

// helper function to return a successful response
function success(res, payload) {
  return res.status(200).json(payload)
}

// route to get all todos from the database and return them as JSON
app.get("/todos", async (req, res, next) => {
  try {
    const todos = await db.Todo.find({})
    return success(res, todos)
  } catch (err) {
    next({ status: 400, message: "failed to get todos" })
  }
})

// route to create a new todo and return it as JSON
app.post("/todos", async (req, res, next) => {
  try {
    const todo = await db.Todo.create(req.body)
    return success(res, todo)
  } catch (err) {
    next({ status: 400, message: "failed to create todo" })
  }
})

// route to update an existing todo and return it as JSON
app.put("/todos/:id", async (req, res, next) => {
  try {
    const todo = await db.Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    return success(res, todo)
  } catch (err) {
    next({ status: 400, message: "failed to update todo" })
  }
})

// route to delete an existing todo and return a success message as JSON
app.delete("/todos/:id", async (req, res, next) => {
  try {
    await db.Todo.findByIdAndRemove(req.params.id)
    return success(res, "todo deleted!")
  } catch (err) {
    next({ status: 400, message: "failed to delete todo" })
  }
})

// route for pending tasks display
app.get("/todos/pending", async (req, res, next) => {
  try {
    const pendingTodos = await db.Todo.find({ completed: false })
    return success(res, pendingTodos)
  } catch (err) {
    next({ status: 400, message: "failed to get pending todos" })
  }
})

// route for completed tasks display
app.get("/todos/completed", async (req, res, next) => {
  try {
    const completedTodos = await db.Todo.find({ completed: true })
    return success(res, completedTodos)
  } catch (err) {
    next({ status: 400, message: "failed to get completed todos" })
  }
})

// error handling middleware to return a JSON response with error details
app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.status || 400,
    message: err.message || "there was an error processing request",
  })
})

// start listening on the specified port
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
