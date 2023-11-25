const cloudinary = require('cloudinary').v2;

const options = {
    overwrite :true,
    invalidate : true,
    resource_type :'auto',
}

cloudinary.config({ 
  cloud_name: 'dmut0goar', 
  api_key: '269945374473742', 
  api_secret: 'DV13bpyeUs5jEU22hb2I8o2oM_E' 
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

