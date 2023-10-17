const express = require("express");
const router = express.Router();
const todoListController = require("../controllers/todoList.controller");
const todoListValidator = require("../validators/todoList.validator");

router.post(
  "/",
  todoListValidator.createTodoItemSchema,
  todoListController.createTodoItem
);

router.get(
  "/",
  todoListValidator.getTodoItemByQuerySchema,
  todoListController.getAllTodoItems
);

router.get(
  "/:id",
  todoListValidator.getTodoItemByParamsSchema,
  todoListController.getSingleTodoItem
);

router.patch(
  "/:id",
  todoListValidator.getTodoItemByParamsSchema,
  todoListValidator.updateTodoItemSchema,
  todoListController.updateTodoItem
);

router.delete(
  "/:id",
  todoListValidator.getTodoItemByParamsSchema,
  todoListController.deleteTodoItem
);

module.exports = router;
