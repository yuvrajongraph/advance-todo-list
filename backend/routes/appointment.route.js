const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const appointmentValidator = require('../validators/appointment.validator')
const isAuthenticate = require("../middlewares/auth.middleware");

router.post(
  "/",
  appointmentValidator.createAppointmentSchema,
  isAuthenticate.verifyToken,
  appointmentController.createAppointment
);

router.get(
  "/",
  appointmentValidator.getAppointmentByQuerySchema,
  isAuthenticate.verifyToken,
  appointmentController.getAllAppointments
);

router.get(
  "/:id",
  appointmentValidator.getAppointmentByParamsSchema,
  isAuthenticate.verifyToken,
  appointmentController.getSingleAppointment
);

router.patch(
  "/:id",
  appointmentValidator.getAppointmentByParamsSchema,
  appointmentValidator.updateAppointmentSchema,
  isAuthenticate.verifyToken,
  appointmentController.updateAppointment
);

router.delete(
  "/:id",
  appointmentValidator.getAppointmentByParamsSchema,
  isAuthenticate.verifyToken,
  appointmentController.deleteAppointment
);

module.exports = router;
