const express = require("express");
const router = express.Router();
const todoListController = require("../controllers/todoList.controller");
const todoListValidator = require("../validators/todoList.validator");

router.post(
  "/",
  todoListValidator.createTodoSchema,
  todoListController.createTodoItem
);

router.get(
  "/",
  todoListValidator.getTodoByQuerySchema,
  todoListController.getAllTodoItems
);

router.get(
  "/:id",
  todoListValidator.TodoParamSchema,
  todoListController.getSingleTodoItem
);

router.patch(
  "/:id",
  todoListValidator.TodoParamSchema,
  todoListValidator.updateTodoSchema,
  todoListController.updateTodoItem
);

router.delete(
  "/:id",
  todoListValidator.TodoParamSchema,
  todoListController.deleteTodoItem
);

module.exports = router;
