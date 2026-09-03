import logo from "../assets/MeetingWatch_Transparent.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchLog = async () => {
      const response = await fetch("http://localhost:4000/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(true);
      }
    };
    fetchLog();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // even if the request fails, still send them back to homepage
    } finally {
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  return (
    <div className="w-full bg-black flex items-center p-2 pb-4">
      <img
        src={logo}
        alt="logo"
        className="h-15 w-28 pt-1 cursor-pointer "
        onClick={() => navigate("/")}
      />
      {isLoggedIn ? (
        <>
          <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto text-sm font-semibold px-4 py-2 rounded-lg text-center cursor-pointer transition-colors"
            style={{
              background: "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
              boxShadow: "0 4px 16px -4px rgba(62,207,142,0.4)",
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleSignOut()}
            className="border cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ml-4 hover:bg-[#E0574C]/10"
            style={{ borderColor: "rgba(224,87,76,0.4)", color: "#E0574C" }}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate("/signin")}
            className="ml-auto text-sm font-semibold px-4 py-2 rounded-lg text-center cursor-pointer transition-colors"
            style={{
              color: "#DCEAE3",
              border: "1px solid rgba(62,207,142,0.4)",
            }}
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
        </>
      )}
    </div>
  );
};

export default Navbar;
