import defaultImage from "../../assets/noprofilepicture.webp";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import {
  useUploadImageMutation,
} from "../../redux/user/userApi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { LinearProgress } from "@mui/material";

const UploadModal = ({ visible, onClose, setProfileImage }) => {
  if (!visible) return null;

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploadImage] = useUploadImageMutation();


  const handleImageData = async (e) => {
    e.preventDefault();
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleCropComplete = (cropData) => {
    if (cropData.width && cropData.height) {
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

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("myImage", croppedImage);
      try {
        const response = await uploadImage(formData);
        if (response.data) {
          setProfileImage(response.data.data.imageLink);
          setLoading(false);
          setFile(null);
          window.location.reload();
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <>
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm">
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
            <div className="w-[200px] m-[auto] mt-[10px]">
              <LinearProgress />
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
