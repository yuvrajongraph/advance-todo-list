const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const multer = require('multer');


// to get the uploaded image saved in uploads folder with an unique name
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
  // for uploading a single file
  upload.single("myImage"),
  userController.uploadImage
);

router.get(
    "/",
    isAuthenticate.verifyToken,
    userController.getSingleUser
  );

module.exports = router; 

