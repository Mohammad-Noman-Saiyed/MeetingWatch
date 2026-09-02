const ScreenshotPlaceholder = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <div
    className={`w-full max-w-md rounded-xl overflow-hidden ${className}`}
    style={{
      background: "#0A0F0D",
      border: "1px solid rgba(62,207,142,0.4)",
      boxShadow: "0 8px 30px -8px rgba(62,207,142,0.4)",
    }}
  >
    <div
      className="flex items-center gap-1.5 px-3 py-2"
      style={{ borderBottom: "1px solid rgba(62,207,142,0.18)" }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3ECF8E" }} />
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#2EB37A" }} />
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#5E7A6F" }} />
    </div>
    <div className="grid place-items-center h-40">
      <p className="text-sm font-medium" style={{ color: "#5E7A6F" }}>
        {label}
      </p>
    </div>
  </div>
);

const Intro = () => {
  return (
    <div
      className="h-auto w-auto grid grid-cols-1 md:grid-cols-2"
      style={{ background: "#0F1613" }}
    >
      <div className="flex flex-col justify-center pl-8">
        <h3 className="font-semi-bold text-white text-4xl py-8">
          What is MeetingWatch?
        </h3>
        <p className="pl-4 pr-16 text-2xl" style={{ color: "#DCEAE3" }}>
          MeetingWatch is a service for you to use to analyze the productiveness
          of each meeting and take impactful actions to increase every meeting's
          quality.
        </p>
        <h3 className="font-semi-bold text-white text-4xl py-8">
          How does it work?
        </h3>
        <p className="pl-4 pr-16 text-2xl" style={{ color: "#DCEAE3" }}>
          Right before you start your meeting, start the MeetingWatch stop watch
          which times how long your meeting is. Optionally, you can select which
          employees/attendees are in the call with you and MeetingWatch should
          display the real-time salary usage every second of the meeting. You
          can enter further details after every meeting such as how productive
          the meeting was and attendee engagement + energy during the meetings
          to provide you with a meeting analysis.
        </p>
        <h3 className="font-semi-bold text-white text-4xl py-8">
          Why use MeetingWatch?
        </h3>
        <p className="pl-4 pr-16 text-2xl pb-36" style={{ color: "#DCEAE3" }}>
          MeetingWatch provides you with weekly, monthly, and yearly summaries
          of your meetings - giving you AI-suggestion on how long you should
          keep your meetings, what should be discussed in the meetings, when you
          should take breaks, etc. All of this can be used to increase and
          maintain attendee productivity throughout meetings to make the most
          out of every meeting.
        </p>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center gap-8 px-8 py-12">
        <ScreenshotPlaceholder
          label="Live meeting cost tracker — preview"
          className="rotate-1"
        />
        <ScreenshotPlaceholder
          label="Meeting analytics dashboard — preview"
          className="-rotate-1"
        />
      </div>
    </div>
  );
};

export default Intro;