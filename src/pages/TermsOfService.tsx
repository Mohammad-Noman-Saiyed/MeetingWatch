import { Link } from "react-router-dom";

const linkClass =
  "text-lg font-semibold cursor-pointer transition-colors text-[#3ECF8E] hover:text-[#2EB37A]";

type Section = {
  title: string;
  body: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
};

const sections: Section[] = [
  {
    title: "Agreement to These Terms",
    body: [
      "These Terms of Service (the “Terms”) form a binding agreement between you and the individual who operates MeetingWatch (“MeetingWatch”, “we”, “us”, or “our”), based in the Province of Ontario, Canada. MeetingWatch is operated by an individual and is not an incorporated company.",
      "By creating an account, accessing, or using MeetingWatch (the “Service”), you confirm that you have read and understood these Terms and agree to be bound by them, together with our Privacy Policy, which is incorporated into these Terms by reference. If you do not agree to these Terms, do not create an account and do not use the Service.",
      "If you are agreeing to these Terms on behalf of an employer, school, club, or other organization, you confirm that you have the authority to bind that organization, and “you” means both you and that organization.",
    ],
    links: [{ label: "Read our Privacy Policy", href: "/privacy" }],
  },
  {
    title: "Who May Use MeetingWatch",
    body: [
      "You must be at least 13 years old to use the Service. If you are under the age of majority where you live, which is 18 in Ontario, you may use the Service only with the permission and involvement of a parent or legal guardian, who accepts these Terms on your behalf and is responsible for your use of the Service.",
      "You must also be able to form a binding contract with us, and you must not be barred from using the Service under any law that applies to you.",
      "To purchase a Premium subscription, you must be of the age of majority where you live and be authorized to use the payment method you provide.",
      "MeetingWatch is not directed at children under 13. If we become aware that we have collected information from a child under 13, we will delete it.",
    ],
  },
  {
    title: "Your Account",
    body: [
      "An account is required to use most of the Service. You agree to provide accurate information when you register and to keep it up to date.",
      "You are responsible for keeping your password confidential and for all activity that occurs under your account. Signed-in sessions expire 24 hours after you sign in, and you may sign out at any time. If you believe someone has accessed your account without your permission, contact us promptly.",
      "Accounts are for use by a single individual. You must not share your credentials with anyone else.",
    ],
  },
  {
    title: "What MeetingWatch Does",
    body: [
      "MeetingWatch helps you keep track of your meetings and make them more efficient. You can track a meeting live with a running timer, or log a meeting manually after it has finished, and then review your history, trends, and comparisons over time.",
      "You may also record attendees and their wage or salary information so that MeetingWatch can estimate what a meeting costs. Recording wage information is optional, and the Service is fully usable without it. MeetingWatch is intended for any group that holds meetings, including students, volunteer organizations, and others whose meetings involve no payroll.",
      "Any cost figure the Service produces is an estimate, calculated from the figures you enter using a simple per-second formula. It is not a payroll record, an accounting record, or a statement of amounts actually paid to anyone.",
    ],
  },
  {
    title: "Information You Enter About Other People",
    body: [
      "MeetingWatch allows you to build an employee roster and attach attendees to your meetings. In doing so, you are entering personal information about people who are not users of the Service, typically their name and, optionally, their wage or salary. Those individuals do not hold a MeetingWatch account, receive no notice from us, and have no means of viewing, correcting, or removing what you have recorded about them.",
      "You are therefore responsible for this information. By entering it, you represent and warrant that:",
    ],
    bullets: [
      "You have the authority, and any consent or other lawful basis required by the laws that apply to you, to collect that information and enter it into the Service.",
      "The information you enter is accurate to the best of your knowledge, and you are permitted to disclose it to us.",
      "Doing so does not breach any employment agreement, confidentiality agreement, workplace policy, collective agreement, or privacy law that applies to you.",
    ],
  },
  {
    title: "Names and Wage Information",
    body: [
      "Wage and salary information is sensitive, and a person's full name is often not necessary for the Service to be useful. You may prefer to use initials, first names, or role labels such as “Designer” or “Attendee 2”. Recording less identifying information reduces risk for all parties.",
      "So that historical cost estimates remain accurate, MeetingWatch stores a snapshot of each attendee's name and wage as recorded at the time of the meeting. Editing or deleting a person from your employee roster afterwards does not change or remove those snapshots: deleting a roster entry unlinks it, but the attendance record is retained so that historical costs do not change. If you require that history to be removed as well, contact us and we will remove it.",
      "If a person you have recorded contacts us about information you entered about them, we may refer them to you, or forward their request to you, so that you can respond.",
    ],
  },
  {
    title: "AI Features and How Your Content Is Processed",
    body: [
      "MeetingWatch's AI advice features are powered by the Gemini API, a third-party service operated by Google. When you use one of those features, MeetingWatch sends information about your meetings to Google in order to generate a response. This section describes what is sent and should be read carefully.",
      "What is sent depends on the feature you use:",
    ],
    bullets: [
      "Ending a live meeting always generates AI advice, and therefore always sends that meeting's title and the full text of its notes to Google as you entered them, together with its duration, your rating and engagement score, whether you marked it as something that could have been an email, and the meeting's total estimated cost.",
      "Requesting advice on a past meeting sends the same information for that meeting.",
      "The advice features on the reports page send only aggregate figures, such as the number of meetings in the period and your averages. They do not send meeting titles or notes.",
      "Logging a meeting manually, viewing your history, and viewing the trend and comparison charts send nothing to Google.",
      "Individual attendee names and individual wage amounts are never sent to Google. Only a meeting's combined total cost, or averages across your meetings, are included.",
    ],
    links: [
      {
        label: "Read Google's Gemini API terms",
        href: "https://ai.google.dev/gemini-api/terms",
      },
    ],
  },
  {
    title: "Google's Use of Content Sent to the Gemini API",
    body: [
      "MeetingWatch currently uses the Gemini API on Google's unpaid service tier. Under Google's published terms for that tier, Google uses content submitted to the API and the responses generated from it to provide, improve, and develop Google's products and services, including its AI models. Google's terms further state that human reviewers may read, annotate, and process API input and output, and that Google takes steps to disconnect this content from your account before human review. MeetingWatch has no control over, and cannot limit or reverse, how Google uses content once it has been sent.",
      "This applies to all MeetingWatch users, on both the Free and Premium plans. A Premium subscription does not change how Google handles content sent to the Gemini API and does not move your content to a different service tier.",
      "Google's terms instruct developers not to submit sensitive, confidential, or personal information to that tier. Accordingly, you must not enter confidential, sensitive, or personal information into meeting titles or meeting notes. This includes client names, personal details about attendees, health information, legal or financial matters, trade secrets, and anything subject to a confidentiality or non-disclosure obligation. Notes should be kept general rather than recording the substance of what was discussed.",
      "If you cannot use the AI features without entering that kind of content, you should not use them. Live tracking, manual logging, cost estimates, history, and the trend and comparison charts all operate without them. Only ending a live meeting requires advice to be generated.",
      "The advice Google generates is stored on your meeting record so that it can be displayed again later without being regenerated.",
    ],
  },
  {
    title: "AI Advice Is Not Professional Advice",
    body: [
      "AI-generated content can be inaccurate, incomplete, or misleading, and the same input can produce different results at different times. Any content the Service generates should be treated as a suggestion for your consideration rather than a conclusion to act upon, and should be reviewed before you rely on it or share it with anyone else.",
      "Nothing produced by the Service constitutes employment, human resources, legal, financial, tax, accounting, or medical advice. You should not rely on MeetingWatch's cost estimates or AI advice when making decisions about any individual's employment, compensation, scheduling, performance, or discipline. Those decisions, and their consequences, remain yours.",
    ],
  },
  {
    title: "Built With AI Assistance",
    body: [
      "MeetingWatch's software was developed with substantial assistance from AI coding tools. Much of the code that runs the Service was drafted with AI and subsequently reviewed, rather than written line by line.",
      "This does not reduce our responsibility for the Service in any way. We remain fully responsible for the operation of MeetingWatch, and these Terms apply exactly as they would to software written entirely by hand. This disclosure is provided in the interest of transparency.",
    ],
  },
  {
    title: "Free and Premium Plans; Payment",
    body: [
      "MeetingWatch offers a Free plan and a paid Premium subscription. The features and price of each are set out on our Pricing page.",
      "Premium costs CA$5.00 per month. Payments are processed by Stripe using its hosted checkout, which means your card details are entered on Stripe's systems and are never received or stored by MeetingWatch. Your payment is also subject to Stripe's own terms and privacy policy.",
      "A Premium subscription renews automatically each month, and your payment method will be charged each month, until you cancel. You may cancel at any time through the billing portal in the app. On cancellation, your subscription remains active until the end of the billing period already paid for, after which your account returns to the Free plan.",
      "Payments are non-refundable, and we do not provide partial or pro-rated refunds for an unused portion of a billing period, for a period during which you did not use the Service, or where a subscription ends part-way through a month. Nothing in this paragraph affects any right you have that cannot be waived under applicable consumer protection law, including Ontario's Consumer Protection Act, 2002.",
      "Prices are shown in Canadian dollars and do not include applicable taxes. If tax becomes chargeable, it will be added at checkout. We may change the price of Premium, and will give reasonable advance notice if we do. A new price applies from your next billing period, and you may cancel before it takes effect if you do not agree to it.",
      "If a payment fails, we may retry it and may suspend Premium features until it succeeds. You should keep your payment details up to date.",
    ],
    links: [
      { label: "See plans and pricing", href: "/pricing" },
      { label: "Stripe's terms", href: "https://stripe.com/legal/consumer" },
      { label: "Stripe's privacy policy", href: "https://stripe.com/privacy" },
    ],
  },
  {
    title: "Plan Limits and Fair Use",
    body: [
      "The Free plan includes usage limits, currently one meeting per rolling 24-hour period and up to three attendees per meeting. These limits are described on the Pricing page and are enforced by the Service. We may change them; if we reduce what the Free plan includes, we will make reasonable efforts to give notice first.",
      "You must not create multiple accounts, or use the Service in any other manner, in order to circumvent plan limits, and you must not use the Service in a way that places an unreasonable load on it or on the third-party services it depends on.",
    ],
  },
  {
    title: "Acceptable Use",
    body: ["You agree not to:"],
    bullets: [
      "Use the Service for any unlawful purpose, or to harass, surveil, or discriminate against anyone.",
      "Enter content that is unlawful, defamatory, hateful, or that infringes anyone else's rights.",
      "Access, or attempt to access, another user's account or data, or any part of our systems you are not authorized to reach.",
      "Probe, scan, or test the security of the Service, or attempt to defeat its authentication or plan limits, other than by reporting an issue to us responsibly.",
      "Scrape or crawl the Service, access it by automated means, or resell or redistribute it.",
      "Copy, modify, reverse engineer, or create derivative works from the software, except where that restriction is unenforceable by law.",
      "Interfere with the operation of the Service, or use it to transmit spam or malicious code.",
      "Use the AI features to generate unlawful content or to attempt to extract the underlying model or its training data.",
    ],
  },
  {
    title: "Monitoring Other People",
    body: [
      "MeetingWatch records information about meetings and the people who attend them. Using it to monitor, evaluate, or make decisions about individual employees, particularly without their knowledge, may be restricted or unlawful in your jurisdiction. Workplace privacy and employment laws vary considerably between jurisdictions.",
      "It is your responsibility to know and comply with the rules that apply to you. We do not review how you use the Service and cannot advise you on this.",
    ],
  },
  {
    title: "Your Content and Ownership",
    body: [
      "You retain ownership of the meeting, employee, and wage information you enter (“Your Content”). We do not claim ownership of it, and we do not sell it.",
      "You grant us a limited, non-exclusive, worldwide, royalty-free licence to host, store, copy, transmit, display, and process Your Content, including sending the parts described above to Google, solely in order to operate and provide the Service to you. This licence exists only so that the Service can function, and it terminates when Your Content is deleted, except that content already sent to Google cannot be recalled.",
      "MeetingWatch, including its software, design, and name, belongs to us and is protected by intellectual property law. These Terms do not grant you any right to use our name or branding.",
      "AI-generated advice is produced by a third-party model from the input you provide. We make no claim of ownership over it, and we make no representation that it is unique to you, as similar inputs may produce similar output for other users.",
    ],
  },
  {
    title: "Service Availability and Changes",
    body: [
      "MeetingWatch is an early-stage product operated by one person. We do not warrant that the Service will be available at any particular time, or that it will be uninterrupted, secure, or error-free, and we do not offer a service level agreement.",
      "We may add, change, suspend, or discontinue any part of the Service, including features currently offered on either plan, and we may take the Service offline for maintenance. If we discontinue the Service entirely, or make a change that significantly reduces what a paid subscription includes, we will make reasonable efforts to give notice.",
      "The Service depends on third parties, including Google, Stripe, and Amazon Web Services, which provides the servers and database it runs on. If one of them becomes unavailable or changes its terms, the Service or the features that rely on it may cease to function.",
      "You should not rely on MeetingWatch as the sole record of any information you cannot afford to lose, and should retain your own copy of anything important.",
    ],
  },
  {
    title: "Termination and Data Deletion",
    body: [
      "You may stop using the Service at any time, and you may cancel a Premium subscription at any time as described above.",
      "Account deletion is not currently self-service. To have your account and its data deleted, email us from the address associated with your account. We will action the request within a reasonable period, and in any event within 30 days. When we delete your account, we remove your account record, your meetings together with their notes and AI advice, your employee roster, and the attendee records attached to your meetings.",
      "Two categories of information cannot be deleted. Content already sent to Google's Gemini API in order to generate AI advice is held by Google under Google's terms and is outside our control. In addition, we and Stripe may be required to retain basic payment and tax records relating to a Premium subscription for as long as the law requires.",
      "We may suspend or terminate your access if you breach these Terms, if we are required to do so by law, or if your use creates a risk to the Service or to other users. Where it is reasonable to do so, we will tell you why and give you an opportunity to remedy the issue first. If we terminate your account for a reason other than your breach of these Terms and you have paid for a period you have not used, we will refund the unused portion.",
    ],
    links: [{ label: "Contact us", href: "/contact" }],
  },
  {
    title: "Disclaimers",
    body: [
      "To the fullest extent permitted by law, the Service is provided “as is” and “as available”, without warranties of any kind, whether express, implied, or statutory, including any implied warranties of merchantability, fitness for a particular purpose, or non-infringement, and any warranty that the Service will be uninterrupted, secure, accurate, or error-free.",
      "In particular, we do not warrant that cost estimates or AI-generated advice are accurate, complete, or suitable for any purpose.",
      "Some jurisdictions do not allow the exclusion of certain warranties. Where that applies to you, the exclusions above apply only to the extent permitted, and you may have rights under Ontario's Consumer Protection Act, 2002 that these Terms do not affect.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenue, data, goodwill, or business opportunity, arising out of or relating to the Service, even if we have been advised that such damages are possible.",
      "To the fullest extent permitted by law, our total aggregate liability for all claims relating to the Service will not exceed the greater of (a) the total amount you paid us in the twelve months before the event giving rise to the claim, and (b) CA$50. These limits apply to all claims, whether based in contract, tort (including negligence), statute, or any other legal theory.",
      "Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited, including liability for fraud or fraudulent misrepresentation, for death or personal injury caused by negligence, or any right you have under Ontario's Consumer Protection Act, 2002.",
      "You acknowledge that these limits are a fundamental part of the agreement between us, and that the Service is offered on its current terms, including free of charge on the Free plan, in reliance on them.",
    ],
  },
  {
    title: "Indemnity",
    body: [
      "You agree to indemnify us and hold us harmless from any third-party claim, demand, loss, liability, or expense (including reasonable legal fees) arising from your breach of these Terms; from information you entered about another person, including any claim brought by that person or by a regulator; from any breach of a confidentiality obligation through what you entered into meeting titles or notes; or from your unlawful use of the Service.",
      "We will notify you of any such claim, and you may assume control of the defence, provided that you do not settle it in a manner that imposes any obligation on us without our consent.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may update these Terms as the Service develops or as the law requires. The effective date at the top of this page indicates when the current version took effect.",
      "Where we make a material change, for example to how your content is processed, to payment terms, or to your rights, we will make reasonable efforts to notify you before it takes effect, by email or within the app. Other changes take effect when they are posted here.",
      "Continuing to use the Service after a change takes effect constitutes acceptance of the updated Terms. If you do not accept them, you should stop using the Service and, if you hold a Premium subscription, cancel it.",
    ],
  },
  {
    title: "Governing Law and Disputes",
    body: [
      "These Terms, and any dispute arising out of them or out of the Service, are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there, without regard to conflict-of-laws rules.",
      "You and we agree that the courts of the Province of Ontario will have jurisdiction over any such dispute. If you are a consumer, nothing in this section deprives you of the protection of the mandatory laws of the province or country where you live, or of any right you have to bring a claim in your local courts.",
      "Before commencing formal proceedings, please contact us so that we have an opportunity to resolve the matter informally.",
    ],
  },
  {
    title: "General",
    body: [
      "If any provision of these Terms is found to be unenforceable, it will be modified to the minimum extent necessary to make it enforceable, or severed if that is not possible, and the remaining provisions will remain in full effect. Our failure to enforce any provision is not a waiver of it.",
      "These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede any earlier discussions or understandings. You may not assign or transfer them. We may assign them to a successor in connection with a merger, acquisition, or sale of assets, on notice to you. These Terms create no rights for anyone who is not a party to them.",
      "We are not liable for any delay or failure to perform caused by events beyond our reasonable control. Headings are for convenience only. The sections covering information about other people, AI processing, ownership, termination, disclaimers, limitation of liability, indemnity, governing law, and this section survive the termination of your account.",
    ],
  },
  {
    title: "Contact",
    body: [
      "If you have questions about these Terms, need to report a problem, or wish to have your account and data deleted, contact us at meeting.watch.support@gmail.com. MeetingWatch is operated from the Province of Ontario, Canada.",
    ],
    links: [
      {
        label: "meeting.watch.support@gmail.com",
        href: "mailto:meeting.watch.support@gmail.com",
      },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">Terms of Service</h1>
        <p className="text-sm" style={{ color: "#5E7A6F" }}>
          Effective date: September 6, 2026
        </p>
        <p className="mt-6 text-lg" style={{ color: "#DCEAE3" }}>
          These Terms set out what you can expect from MeetingWatch and what we
          expect from you.
        </p>

        {sections.map((s, index) => (
          <div key={s.title}>
            <h3 className="font-bold text-white text-2xl py-6">
              {index + 1}. {s.title}
            </h3>

            {s.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg mb-4"
                style={{ color: "#DCEAE3" }}
              >
                {paragraph}
              </p>
            ))}

            {s.bullets && (
              <div className="flex flex-col gap-3 mb-4">
                {s.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-2.5"
                      style={{ background: "#3ECF8E" }}
                    />
                    <span className="text-lg" style={{ color: "#DCEAE3" }}>
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {s.links && s.links.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {s.links.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link key={link.href} to={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;
