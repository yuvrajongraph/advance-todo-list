const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config')

const verifyToken = async (req, res, next) => {
      const header = req.headers["authorization"];
      const token = header ? header.split(" ")[1] : null;
    
      if (!token) {
        return res.status(401).json({
            error:"Access denied"
        })
      }
    
      if(token !== req.cookies.token){
        return res.status(401).json({
            error:"Access denied"
        })
      }
  
      let decoded_jwt = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findOne({_id: decoded_jwt._id});
      if (!user) {
        return res.status(401).json({
            error:"User not found"
        })
      }
      req.user = user;
  
      next();
    
  };

module.exports={verifyToken}