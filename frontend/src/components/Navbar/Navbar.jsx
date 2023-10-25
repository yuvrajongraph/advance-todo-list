import React from "react";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [authenticated, cookie] = useAuth();
  const userName = cookie?.userData?.details?.name;
  const userArray = userName?.split(" ");
  const firstCharacters = userArray?.map((str, index) => {
    if (index < 2) {
      return str.charAt(0);
    } else {
      return "";
    }
  });
  const result = firstCharacters?.reduce((accumulator, currentCharacter) => {
    return accumulator + currentCharacter;
  }, "");
  console.log();
  return (
    <div className="bg-blue-500 p-4 flex items-center justify-between">
      <div className="text-white text-2xl font-semibold m-[auto]">
        Advance Todo App
      </div>
      <div className="flex items-center">
        <div className="bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xl">
          {result}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
