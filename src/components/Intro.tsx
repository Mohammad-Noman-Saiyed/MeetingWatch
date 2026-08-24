const Intro = () => {
  return (
    <div className="bg-gray-500 h-auto w-auto grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center pl-8">
        <h3 className="font-bold text-white text-4xl py-8">
          What is MeetingWatch?
        </h3>
        <p className="pl-4 pr-16 text-2xl text-gray-200">
          MeetingWatch is a service for you to use to analyze the productiveness
          of each meeting and take impactful actions to increase every meeting's
          quality.
        </p>
        <h3 className="font-bold text-white text-4xl py-8">
          How does it work?
        </h3>
        <p className="pl-4 pr-16 text-2xl text-gray-200">
          Right before you start your meeting, start the MeetingWatch stop watch
          which times how long your meeting is. Optionally, you can select which
          employees/attendees are in the call with you and MeetingWatch should
          display the real-time salary usage every second of the meeting. You
          can enter further details after every meeting such as how productive
          the meeting was and attendee engagement + energy during the meetings
          to provide you with a meeting analysis.
        </p>
        <h3 className="font-bold text-white text-4xl py-8">
          Why use MeetingWatch?
        </h3>
        <p className="pl-4 pr-16 text-2xl text-gray-200">
          MeetingWatch provides you with weekly, monthly, and yearly summaries
          of your meetings - giving you AI-suggestion on how long you should
          keep your meetings, what should be discussed in the meetings, when you
          should take breaks, etc. All of this can be used to increase and
          maintain attendee productivity throughout meetings to make the most
          out of every meeting.
        </p>
      </div>
    </div>
  );
};

export default Intro;
