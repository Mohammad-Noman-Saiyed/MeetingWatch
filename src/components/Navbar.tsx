import logo from "../assets/MeetingWatch_Transparent.png";
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
        onClick={() => navigate("/signin")}
        className="ml-auto text-sm font-semibold px-4 py-2 rounded-lg text-center cursor-pointer transition-colors"
        style={{ color: "#DCEAE3", border: "1px solid rgba(62,207,142,0.4)" }}
      >
        Sign in
      </button>
      <button
        onClick={() => navigate("/signup")}
        className="ml-4 text-sm font-semibold px-4 py-2 rounded-lg text-center text-black cursor-pointer transition-transform hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
          boxShadow: "0 4px 16px -4px rgba(62,207,142,0.4)",
        }}
      >
        Sign up
      </button>
    </div>
  );
};

export default Navbar;
