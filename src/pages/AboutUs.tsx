const AboutUs = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">About Us</h1>
        <p className="text-xl" style={{ color: "#DCEAE3" }}>
          MeetingWatch was built to make the true cost of meetings visible.
          We believe every meeting should earn its place on your calendar —
          so we built a tool that tracks meeting cost in real time and turns
          that data into AI-powered advice you can actually act on.
        </p>
        <p className="mt-6 text-xl" style={{ color: "#DCEAE3" }}>
          We're a small team focused on helping teams run fewer, better
          meetings.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;