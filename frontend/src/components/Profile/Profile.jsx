import defaultImage from "../../assets/bg1.jpg";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useUploadImageMutation, useGetSingleUserMutation } from "../../redux/user/userApi";

const Profile = ({ userDetail }) => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(userDetail);
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadImage] = useUploadImageMutation();
  const [getSingleUser] = useGetSingleUserMutation();

  const handleImageData = async (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("myImage", file);
      try {
        const response = await uploadImage(formData);
        if (response.data) {
          setProfileImage(response.data.data.imageLink);
          setLoading(false);
          //window.location.reload();
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const getUser = async()=>{
    const response = await getSingleUser();

    if(response.data){
        setProfileImage(response.data.data.url)
    }
  }
  useEffect(()=>{
    getUser();
  },[])



  return (
    <>
     <div className=" mt-[60px]">
      <h1>{user?.name}</h1>
      <input
        type="file"
        onChange={handleImageData}
        name="myImage"
        accept="image/*"
      />
      <Button
        variant="contained"
        color="primary"
        className="m-3"
        onClick={handleImageUpload}
      >
        {loading ? "Uploading...." : "Upload Image"}
      </Button>
      
      <img
        src={profileImage === "" ? defaultImage : profileImage}
        alt=""
        className="h-[300px] w-[300px] mt-[20px] ml-[450px]"
      />
      </div>
    </>
  );
};

export default Profile;
