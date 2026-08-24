import logo from "../assets/MeetingWatchLogo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-black flex items-center p-2 pb-4">
      <img
        src={logo}
        alt="logo"
        className="h-15 w-28 pt-1 cursor-pointer "
        
        onClick={() => navigate("/")}
      />
      <button
        
        onClick={() => navigate("/signup")}
        className="text-white cursor-pointer px-4 py-1 pt-1 bg-black hover:bg-gray-500 transition border-2 border-white rounded-lg text-center ml-auto"
      >
        Sign up
      </button>
      <button
        
        onClick={() => navigate("/signin")}
        className="bg-black hover:bg-gray-500 transition ml-4 pt-1 text-white px-4 py-1 border-2 border-white rounded-lg text-center cursor-pointer"
      >
        Sign in
      </button>
    </div>
  );
};

export default Navbar;
