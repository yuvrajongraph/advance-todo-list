import defaultImage from "../../assets/noprofilepicture.webp";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetSingleUserMutation } from "../../redux/user/userApi";
import UploadModal from "./UploadModal";

const Profile = ({ userDetail }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(userDetail);
  const [profileImage, setProfileImage] = useState("");
  const [getSingleUser] = useGetSingleUserMutation();

  const handleShowModal = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleOnClose = () => {
    setShowModal(false);
  };

  const getUser = async () => {
    const response = await getSingleUser();

    if (response.data) {
      setProfileImage(response.data.data.url);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
 // it is a profile section where name and image is present of a specific user
  return (
    <>
      <div className=" mt-[60px]">
        <h1>{user?.name}</h1>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleShowModal}
        >
          Upload Image
        </Button>
        <img
          src={profileImage === "" ? defaultImage : profileImage}
          alt=""
          className="h-[300px] w-[300px] mt-[20px] ml-[450px]"
        />
      </div>
      <UploadModal
        visible={showModal}
        onClose={handleOnClose}
        setProfileImage={setProfileImage}
      />
    </>
  );
};

export default Profile;
