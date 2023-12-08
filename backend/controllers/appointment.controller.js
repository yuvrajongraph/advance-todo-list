const Appointment = require("../models/appointment.model");
const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");

// @desc    Add Appointment
// @route   POST /api/appointment
// @access  Private

const createAppointment = asyncHandler(async (req, res) => {
    const body = req.body;
    
    req.body.userId = req.user._id;
    body.startTime = new Date(body.startTime);
    body.endTime = new Date(body.endTime);

    const currentDateTime = new Date();
    if(body.endTime < currentDateTime){
      return commonErrorHandler(req, res, null, 404, "Please, choose date above or equal to current date ");
    }

    if(body.startTime > body.endTime){
        return commonErrorHandler(req, res, null, 404, "Please, choose start time less than the end time for an appointment");
    }

    // create a schema appointment
    const appointment = new Appointment(body);

    // save appointment in DB
    const data = await appointment.save();

    // final response
    return commonErrorHandler(
      req,
      res,
      { data, quote: "Appointment has been created" },
      201
    );

});

// @desc    Get All Appointments
// @route   GET  /api/appointment
// @access  Private

// @desc    Get All Appointment By Category
// @route   GET  /api/appointment?category=?
// @access  Private

const getAllAppointments = asyncHandler(async (req, res) => {

    const query = {};

    for (const key in req.query) {
      // eslint-disable-next-line no-prototype-builtins
      if (req.query.hasOwnProperty(key)) {
        query[key] = req.query[key];
      }
    }

    // filter the data according to dynamic field given in request query
    const data = await Appointment.find({$and:[query,{userId:req.user._id}]});

    //final response
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
});

// @desc    Get Single Appointment
// @route   GET  /api/appointment/:id
// @access  Private

const getSingleAppointment = asyncHandler(async (req, res) => {
  
    const params = req.params;

    // find the appointment in DB with the help of param id
    const data = await Appointment.find({$and:[ {_id: params.id},{userId:req.user._id}],  });

    // final response
    return commonErrorHandler(req, res, { data, quote: "OK" }, 200);
  
});

// @desc    Update a Appointment 
// @route   PATCH  /api/appointment/:id
// @access  Private

const updateAppointment = asyncHandler(async (req, res) => {

    const params = req.params;
    const body = req.body;
    body.startTime = new Date(body.startTime);
    body.endTime = new Date(body.endTime);

    
    const currentDateTime = new Date();
    if(body.endTime < currentDateTime){
      return commonErrorHandler(req, res, null, 404, "Please, choose date above or equal to current date ");
    }

    if(body.startTime > body.endTime){
        return commonErrorHandler(req, res, null, 404, "Please, choose start time less than the end time for an appointment");
    }

    // find and update appointment in DB
    const data = await Appointment.findOneAndUpdate(
      {$and:[ {_id: params.id},{userId:req.user._id}] },
      { $set: body }
    );

    // if data is not found in DB
    if (!data) {
      return commonErrorHandler(req, res, null, 404, "Appointment not found");
    }

    // final response
    return commonErrorHandler(
      req,
      res,
      { data: body, quote: "Appointment updated successfully" },
      200
    );

});

// @desc    Delete a Appointment
// @route   DELETE  /api/appointment/:id
// @access  Private

const deleteAppointment = asyncHandler(async (req, res) => {

    const params = req.params;

    // find and delete appointment in DB
    const data = await Appointment.findOneAndRemove({$and:[ {_id: params.id},{userId:req.user._id}] });
    if (!data) {
      return commonErrorHandler(req, res, null, 404, "Appointment not found");
    }

    // final response
    return commonErrorHandler(
      req,
      res,
      { data, quote: "Appointment deleted successfully" },
      200
    );
});

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  getSingleAppointment,
};
