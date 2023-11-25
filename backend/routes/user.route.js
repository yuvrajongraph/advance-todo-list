const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + file.originalname)
    }
})

const upload = multer({
    storage: storage
})

router.post(
  "/upload-image",
  isAuthenticate.verifyToken,
  upload.single("myImage"),
  userController.uploadImage
);

router.get(
    "/",
    isAuthenticate.verifyToken,
    userController.getSingleUser
  );

module.exports = router; 

