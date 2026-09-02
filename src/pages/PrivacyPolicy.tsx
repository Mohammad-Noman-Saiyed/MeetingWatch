const sections = [
  {
    title: "Data We Collect",
    body: "We collect the account information you provide (name, email) and the meeting, employee, and wage data you enter to power MeetingWatch's features.",
  },
  {
    title: "How We Use Your Data",
    body: "Your data is used to calculate meeting costs, generate AI advice, and display your meeting history and trends back to you. We do not sell your data.",
  },
  {
    title: "AI Processing",
    body: "Meeting and employee data may be sent to our AI provider to generate advice. This data is used only to produce your response.",
  },
  {
    title: "Data Retention",
    body: "Your data is retained as long as your account is active. You may request deletion of your account and associated data at any time.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">
          Privacy Policy
        </h1>
        <p className="text-sm italic" style={{ color: "#5E7A6F" }}>
          Placeholder policy — this page has not yet had a legal review and
          should not be treated as binding until it does.
        </p>
        {sections.map((s) => (
          <div key={s.title}>
            <h3 className="font-bold text-white text-2xl py-6">{s.title}</h3>
            <p className="text-lg" style={{ color: "#DCEAE3" }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;