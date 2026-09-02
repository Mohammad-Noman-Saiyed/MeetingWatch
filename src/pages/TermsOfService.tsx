const sections = [
  {
    title: "Acceptance of Terms",
    body: "By creating an account or using MeetingWatch, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.",
  },
  {
    title: "Use of Service",
    body: "You agree to use MeetingWatch only for lawful purposes and to provide accurate information about attendees and wages you record.",
  },
  {
    title: "Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
  },
  {
    title: "Changes to the Service",
    body: "MeetingWatch may update or discontinue features at any time. We will make reasonable efforts to notify users of significant changes.",
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">
          Terms of Service
        </h1>
        <p className="text-sm italic" style={{ color: "#5E7A6F" }}>
          Placeholder terms — this page has not yet had a legal review and
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

export default TermsOfService;