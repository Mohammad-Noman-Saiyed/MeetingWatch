import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const MainPage = () => {
  const [Efficient, setEfficient] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="min-h-128 pb-16 font-bitcoin flex flex-col items-center"
      style={{ background: "#0A0F0D" }}
    >
      <TypeAnimation
        sequence={[
          // 1. Type the text
          "Make Meetings More",
          () => setEfficient(true), // 2. Wait 1 second after typing
        ]}
        wrapper="span"
        speed={20}
        className="text-white grid place-items-center pt-35 font-bitcount text-[56px]"
        repeat={0}
        cursor={false}
      />
      {Efficient && (
        <>
          <TypeAnimation
            sequence={["Efficient"]}
            wrapper="span"
            speed={20}
            className="grid place-items-center font-bitcount text-[56px]"
            style={{ color: "#3ECF8E" }}
            repeat={0}
            cursor={false}
          />
          <p className="pt-8 text-lg" style={{ color: "#d9dbd9" }}>
            Track live meeting costs, get AI-powered advice, optimize meeting
            lengths, and stop paying for meetings that don't pay off.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-8 text-base font-semibold px-8 py-3 rounded-lg text-center text-black cursor-pointer transition-transform hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
              boxShadow: "0 8px 30px -8px rgba(62,207,142,0.4)",
            }}
          >
            Get Started Now
          </button>
        </>
      )}
    </div>
  );
};
// bob@gmail.com
// testpass123
// first name: Yes   lsatname: No
export default MainPage;