const Todo = require("../models/todoList.model");
const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");

// @desc    Add Todo Item
// @route   POST /api/todo-list
// @access  Private

const createTodoItem = asyncHandler(async (req, res) => {
  try {
    const body = req.body;

    // create a schema todo item
    const todo = new Todo(body);

    // if something in syntax goes wrong
    if (!todo) {
      throw new Error();
    }

    // save todo item in DB
    const data = await todo.save();
    if (!data) {
      throw new Error();
    }

    // final response
    return commonErrorHandler(
      req,
      res,
      { data, quote: "Item has been created" },
      201
    );
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

// @desc    Get All Todo Items
// @route   GET  /api/todo-list
// @access  Private

// @desc    Get All Todo Items By Category
// @route   GET  /api/todo-list?category=?
// @access  Private

const getAllTodoItems = asyncHandler(async (req, res) => {
  try {
    const query = {};

    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        query[key] = req.query[key];
      }
    }

    // filter the data according to dynamic field given in request query
    const data = await Todo.find(query);

    //final response
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

// @desc    Get Single Todo Item
// @route   GET  /api/todo-list/:id
// @access  Private

const getSingleTodoItem =asyncHandler(async (req, res) => {
  try {
    const params = req.params;

    // find the todo item in DB with the help of param id
    const data = await Todo.find({ _id: params.id });

    // final response
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

// @desc    Update a Todo Item
// @route   PATCH  /api/todo-list/:id
// @access  Private

const updateTodoItem =asyncHandler(async (req, res) => {
  try {
    const params = req.params;
    const body = req.body;

    // find and update todo item in DB
    const data = await Todo.findOneAndUpdate(
      { _id: params.id },
      { $set: body }
    );

    // if data is not found in DB
    if (!data) {
      return commonErrorHandler(req, res, null, 404, "Item not found");
    }

    // final response
    return commonErrorHandler(
      req,
      res,
      { data: body, quote: "Item updated successfully" },
      200
    );
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

// @desc    Delete a Todo Item
// @route   DELETE  /api/todo-list/:id
// @access  Private

const deleteTodoItem =asyncHandler(async (req, res) => {
  try {
    const params = req.params;

    // find and delete todo item in DB
    const data = await Todo.findOneAndRemove({ _id: params.id });
    if (!data) {
      return commonErrorHandler(req, res, null, 404, "Item not found");
    }

    // final response
    return commonErrorHandler(
      req,
      res,
      { data, quote: "Item deleted successfully" },
      200
    );
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

module.exports = {
  createTodoItem,
  getAllTodoItems,
  updateTodoItem,
  deleteTodoItem,
  getSingleTodoItem,
};
