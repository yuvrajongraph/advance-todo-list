const Todo = require("../models/todoList.model");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

// @desc    Add Todo Item
// @route   POST /api/todo-list
// @access  Private

const createTodoItem = async (req, res) => {
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
};

// @desc    Get All Todo Items
// @route   GET  /api/todo-list
// @access  Private

// @desc    Get All Todo Items By Category
// @route   GET  /api/todo-list?category=?
// @access  Private

const getAllTodoItems = async (req, res) => {
  try {
    const query = req.query;

    // if no query is given to api
    if (Object.keys(req.query).length === 0) {
      const data = await Todo.find({});
      return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
    }

    // if apecific category given in query
    const data = await Todo.find({ category: query.category });

    //final response
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
};

// @desc    Get Single Todo Item
// @route   GET  /api/todo-list/:id
// @access  Private

const getSingleTodoItem = async (req, res) => {
  try {
    const params = req.params;

    // find the todo item in DB with the help of param id
    const data = await Todo.find({ _id: params.id });

    // final response
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
};

// @desc    Update a Todo Item
// @route   PATCH  /api/todo-list/:id
// @access  Private

const updateTodoItem = async (req, res) => {
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
};

// @desc    Delete a Todo Item
// @route   DELETE  /api/todo-list/:id
// @access  Private

const deleteTodoItem = async (req, res) => {
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
};

module.exports = {
  createTodoItem,
  getAllTodoItems,
  updateTodoItem,
  deleteTodoItem,
  getSingleTodoItem,
};
