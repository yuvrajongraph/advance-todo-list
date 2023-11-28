const cloudinary = require('cloudinary').v2;
const config = require('../config/config')

const options = {
    overwrite :true,
    invalidate : true,
    resource_type :'auto',
}

cloudinary.config({ 
  cloud_name: config.CLOUD_NAME, 
  api_key: config.API_KEY, 
  api_secret: config.API_SECRET 
});

const uploadImageCloudinary = async(path)=>{
   
   const result =  await cloudinary.uploader.upload(path.toString(),{
        folder:'products',
    })
           if(result && result.secure_url){
            return result.secure_url;
        }
        else{
            console.log(error.message);
            return {message : error.message};
        }
}

module.exports = uploadImageCloudinary;

