const cloudinary = require('cloudinary').v2;
const config = require('../config/config')

const options = {
    overwrite :true,
    invalidate : true,
    resource_type :'auto',
}

// configuration of cloudinary account in the server
cloudinary.config({ 
  cloud_name: config.CLOUD_NAME, 
  api_key: config.API_KEY, 
  api_secret: config.API_SECRET 
});

const uploadImageCloudinary = async(path)=>{
   
    // all the uploaded file goes to the products folder on cloudinary media explorer
   const result =  await cloudinary.uploader.upload(path.toString(),{
        folder:'products',
    })
           if(result && result.secure_url){
            // return the cloudinary link of the uploaded image on web app
            return result.secure_url;
        }
        else{
            console.log(error.message);
            return {message : error.message};
        }
}

module.exports = uploadImageCloudinary;

