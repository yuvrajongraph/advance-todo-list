const express = require('express');
const router = express.Router();
const todoListController = require('../controllers/todoList.controller');
const todoListValidator = require('../validators/todoList.validator')

router.post("/", todoListValidator.createTodoSchema, todoListController.createItem);

router.get("/", todoListValidator.getTodoByQuerySchema,todoListController.getAllItems);

router.get("/:id", todoListValidator.TodoParamSchema,todoListController.getItem);

router.patch("/:id", todoListValidator.TodoParamSchema,todoListValidator.updateTodoSchema,todoListController.updateItem);

router.delete("/:id", todoListValidator.TodoParamSchema,todoListController.deleteItem);

module.exports = router;