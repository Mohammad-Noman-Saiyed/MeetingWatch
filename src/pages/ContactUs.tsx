const ContactUs = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">Contact Us</h1>
        <p className="text-xl" style={{ color: "#DCEAE3" }}>
          Questions, feedback, or need help with your account? Reach out and
          we'll get back to you.
        </p>
        <a
          href="mailto:support@meetingwatch.com"
          className="mt-6 inline-block text-xl font-semibold cursor-pointer transition-colors text-[#3ECF8E] hover:text-[#2EB37A]"
        >
          support@meetingwatch.com
        </a>
      </div>
    </div>
  );
};

export default ContactUs;