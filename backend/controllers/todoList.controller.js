const Todo = require("../models/todoList.model");

const createItem = async(req, res) => {
  const body = req.body;

  const todo = new Todo(body);
  const data = await todo.save();
  if(!data){
    return res.status(400).json({
      error:"Item cannot be saved"
    })
  }
  return res.status(201).json(data);

};

const getAllItems = async (req, res) => {
  const query = req.query;
  if (Object.keys(req.query).length === 0) {
    const data = await Todo.find({});
    return res.status(200).json(data);
  }
  const data = await Todo.find({ category: query.category });
   return res.status(200).json(data);
};

const getItem = async(req, res) => {
  const params = req.params;
  const data = await Todo.find({ _id: params.id })
  if(!data){
    return res.status(404).json({
      error:" Item not found"
    })
  }
  return res.status(200).json(data);
};

const updateItem = async (req, res) => {
  const params = req.params;
  const body = req.body;
  const doc = await Todo.findOneAndUpdate({ _id: params.id }, {$set:body});
  if (!doc) {
    return res.status(404).json({
      error: "Item not found",
    });
  }

  return res.status(200).json({
    message: "item updated successfully",
    data: body
  });
};

const deleteItem = async (req, res) => {
  const params = req.params;
  const result = await Todo.findOneAndRemove({ _id: params.id });
  if (!result) {
    return res.status(404).json({
      error: "Item not found",
    });
  }
  return res.status(200).json({
    message: "item deleted successfully",
    data: result
  });
};

module.exports = { createItem, getAllItems, updateItem, deleteItem, getItem };
