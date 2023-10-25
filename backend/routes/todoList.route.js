const express = require("express");
const router = express.Router();
const todoListController = require("../controllers/todoList.controller");
const todoListValidator = require("../validators/todoList.validator");
const isAuthenticate = require("../middlewares/auth.middleware");

router.post(
  "/",
  todoListValidator.createTodoItemSchema,
  isAuthenticate.verifyToken,
  todoListController.createTodoItem
);

router.get(
  "/",
  todoListValidator.getTodoItemByQuerySchema,
  isAuthenticate.verifyToken,
  todoListController.getAllTodoItems
);

router.get(
  "/:id",
  todoListValidator.getTodoItemByParamsSchema,
  isAuthenticate.verifyToken,
  todoListController.getSingleTodoItem
);

router.patch(
  "/:id",
  todoListValidator.getTodoItemByParamsSchema,
  todoListValidator.updateTodoItemSchema,
  isAuthenticate.verifyToken,
  todoListController.updateTodoItem
);

router.delete(
  "/:id",
  todoListValidator.getTodoItemByParamsSchema,
  isAuthenticate.verifyToken,
  todoListController.deleteTodoItem
);

module.exports = router;
