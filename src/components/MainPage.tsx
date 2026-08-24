import { useState } from "react";
import { TypeAnimation } from "react-type-animation";

const MainPage = () => {
  const [Efficient, setEfficient] = useState(false);
  return (
    <div className="bg-black h-128 font-bitcoin">
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
        <TypeAnimation
          sequence={["Efficient"]}
          wrapper="span"
          speed={20}
          className="text-green-600 grid place-items-center font-bitcount text-[56px]"
          repeat={0}
          cursor={false}
        />
      )}
    </div>
  );
};
// bob@gmail.com
// testpass123
// first name: Yes   lsatname: No
export default MainPage;
