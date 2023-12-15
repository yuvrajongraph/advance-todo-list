import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
//import { useUploadImageMutation } from "../../redux/user/userApi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { LinearProgress } from "@mui/material";
import "./UploadModal.css";

let originalFile = null;

const UploadModal = ({ visible, onClose, setProfileImage }) => {
  if (!visible) return null;
  const [authenticated, cookie] = useAuth();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCropImage, setIsCropImage] = useState(false);

  //const [uploadImage] = useUploadImageMutation();

  // set the file that have choosen from frontend
  const handleImageData = async (e) => {
    e.preventDefault();
    originalFile = e.target.files[0];
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  // handle the cropping functionality
  const handleCropComplete = (cropData) => {
    if (cropData.width && cropData.height) {
      setIsCropImage(true);
      getCroppedImage(cropData);
    }
  };

  const getCroppedImage = (cropData) => {
    const image = new Image();
    image.src = file;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    image.onload = () => {
      canvas.width = cropData.width;
      canvas.height = cropData.height;
      ctx.drawImage(
        image,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        cropData.width,
        cropData.height
      );

      canvas.toBlob((blob) => {
        setCroppedImage(blob);
      });
    };
  };

  // give the image file to backend so that it can set the user profile image
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      const image = isCropImage? croppedImage : originalFile
      formData.append("myImage", image);
      const yourToken = cookie.userData.token
      setLoading(true);
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/upload-image`, formData, {
        headers: {
           'Authorization': `Bearer ${yourToken}`,
        },
        // for keeping the track of progress bar of image get upload according to its size
        onUploadProgress: ({loaded,total}) => {
          const progress = Math.floor((loaded / total) * 100);
          setProgress(progress);
        },
      })
      .then((response) => {
        if (response.data) {
          setProfileImage(response.data.data.imageLink);
          setLoading(false);
          setFile(null);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Upload Failed:', error);
      });
      // try {
      //   const response = await uploadImage(formData);
      //   if (response.data) {
      //     setProfileImage(response.data.data.imageLink);
      //     setLoading(false);
      //     setFile(null);
      //     window.location.reload();
      //   }
      // } catch (error) {
      //   console.error("Error uploading file:", error);
      // }
    }
  };

  return (
    <>
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30">
        <div className=" mt-[60px]">
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
          <Button
            variant="contained"
            color="primary"
            style={{ backgroundColor: "red", marginLeft: "10px" }}
            onClick={onClose}
          >
            Cancel
          </Button>
          {loading && (
            <div className="progressbar">
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: "#a66cff",
                  transition: "width 0.5s",
                }}
              ></div>
              <span className="progressPercent">{progress}%</span>
            </div>
          )}

          {file && (
            <div className="mt-[20px]">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={handleCropComplete}
              >
                <img src={file} className=" " />
              </ReactCrop>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadModal;
