const Todo = require("../models/todoList.model");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

const createTodoItem = async (req, res) => {
  try {
    const body = req.body;

    const todo = new Todo(body);
    if (!todo) {
      throw new Error();
    }
    const data = await todo.save();
    if (!data) {
      throw new Error();
    }

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

const getAllTodoItems = async (req, res) => {
  try {
    const query = req.query;
    if (Object.keys(req.query).length === 0) {
      const data = await Todo.find({});
      return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
    }
    const data = await Todo.find({ category: query.category });
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
};

const getSingleTodoItem = async (req, res) => {
  try {
    const params = req.params;
    const data = await Todo.find({ _id: params.id });

    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
};

const updateTodoItem = async (req, res) => {
  const params = req.params;
  try {
    const body = req.body;
    const data = await Todo.findOneAndUpdate(
      { _id: params.id },
      { $set: body }
    );
    if (!data) {
      return commonErrorHandler(req, res, null, 404, "Item not found");
    }

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

const deleteTodoItem = async (req, res) => {
  try {
    const params = req.params;
    const data = await Todo.findOneAndRemove({ _id: params.id });
    if (!data) {
      return commonErrorHandler(req, res, null, 404, "Item not found");
    }
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
