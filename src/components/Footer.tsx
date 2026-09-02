import { Link } from "react-router-dom";
import logo from "../assets/MeetingWatch_Transparent.png";

const linkClass =
  "text-sm cursor-pointer transition-colors text-[#DCEAE3] hover:text-[#3ECF8E]";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0A0F0D",
        borderTop: "1px solid rgba(62,207,142,0.18)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img src={logo} alt="logo" className="h-15 w-28" />
          <p className="mt-2 text-sm" style={{ color: "#5E7A6F" }}>
            Track live meeting costs, get AI-powered advice, optimize meeting
            lengths, and stop paying for meetings that don't pay off.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wide">
            Company
          </h4>
          <Link to="/about" className={linkClass}>
            About Us
          </Link>
          <Link to="/contact" className={linkClass}>
            Contact Us
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wide">
            Legal
          </h4>
          <Link to="/terms" className={linkClass}>
            Terms of Service
          </Link>
          <Link to="/privacy" className={linkClass}>
            Privacy Policy
          </Link>
        </div>
      </div>

      <div
        className="px-6 md:px-8 py-4 text-center text-xs"
        style={{
          color: "#5E7A6F",
          borderTop: "1px solid rgba(62,207,142,0.18)",
        }}
      >
        © 2026 MeetingWatch. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;