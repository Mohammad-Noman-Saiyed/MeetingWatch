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
    title: "About This Policy and Who Is Responsible",
    body: [
      "This Privacy Policy explains what personal information MeetingWatch (“we”, “us”, or “our”) collects, how we use it, who we disclose it to, how long we retain it, and the rights you have over it. It applies to your use of the MeetingWatch website and service (the “Service”) and forms part of our Terms of Service.",
      "MeetingWatch is operated by an individual based in the Province of Ontario, Canada, and is not an incorporated company. That individual is accountable for the personal information described in this policy and can be reached at meeting.watch.support@gmail.com. We will provide their name and mailing address on request.",
      "We handle personal information in accordance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable Ontario law. We extend the rights set out in this policy to all users, regardless of where they live.",
    ],
    links: [
      { label: "Read our Terms of Service", href: "/terms" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Information You Give Us",
    body: [
      "The information described in this section is information you enter into MeetingWatch yourself. We do not purchase personal information, and we do not obtain information about you from third-party sources.",
      "When you create an account, we collect your email address and a password. Passwords are hashed using argon2 before storage; we do not retain your password itself and cannot read or recover it. You may also provide a first and last name, which are optional.",
      "When you track or log a meeting, we store the details you provide:",
    ],
    bullets: [
      "The meeting's title and the date it took place.",
      "Its duration, taken either from the start and end times recorded when you track a meeting live, or from the duration you enter when logging one afterwards.",
      "Any notes you write about the meeting.",
      "Your overall rating, your engagement score, and whether you marked the meeting as one that could have been an email.",
      "The attendees you selected and the estimated total cost calculated from their recorded wages.",
      "Any AI-generated advice for that meeting, which is stored so that it can be displayed again without being regenerated.",
    ],
  },
  {
    title: "Information You Enter About Other People",
    body: [
      "MeetingWatch allows you to maintain a roster of people and attach them as attendees to your meetings. For each person you may record a name and, optionally, a wage or salary and whether it is hourly or annual.",
      "The people on your roster are not users of MeetingWatch. They do not hold an account, receive no notice from us, and have no means of signing in to view, correct, or remove the information recorded about them. We have no relationship with them and generally no way to contact them. You determine what is recorded about them, and our Terms of Service ask you to confirm that you are permitted to enter it.",
      "To keep historical cost estimates accurate, MeetingWatch stores a snapshot of each attendee's name and wage as recorded on the date of the meeting. Removing a person from your roster does not remove these snapshots: deleting a roster entry unlinks it, but the attendance record is retained so that historical costs do not change. If you want that history removed as well, contact us and we will remove it.",
      "A full name is often not necessary for the Service to be useful. You may prefer to use initials, first names, or role labels such as “Designer” or “Attendee 2”. Wage information is sensitive, and recording less of it reduces risk both for you and for the people concerned.",
      "If a person you have recorded contacts us about information you entered about them, we may refer them to you, or forward their request to you, so that you can respond.",
    ],
  },
  {
    title: "Information We Do Not Collect",
    body: [
      "MeetingWatch does not use analytics, advertising, tracking pixels, session recording, or device fingerprinting. We do not build advertising profiles, do not track you across other websites, and do not sell or share personal information with data brokers or advertisers. The site loads no third-party scripts, fonts, or other external resources.",
      "We do not request or store your phone number, postal address, date of birth, location, or a profile photo. The Service does not request access to your camera, microphone, contacts, calendar, or files.",
      "Our server receives your device's IP address as a necessary part of responding to your requests, as any web server does. We do not record it in our database, and no feature of the Service uses it to identify, track, or profile you. Where the Service is hosted on third-party infrastructure, that provider may retain standard server logs, which typically include IP addresses, for security and reliability purposes.",
    ],
  },
  {
    title: "Cookies and Browser Storage",
    body: [
      "MeetingWatch sets a single cookie, named session_id. It is created when you sign in and is what keeps you signed in as you move between pages. It contains a random value and no personal information.",
      "The cookie is marked HttpOnly, so it cannot be read by scripts running on the page, and SameSite=Strict, so your browser will not send it when you arrive from another site. It expires 24 hours after you sign in. When you sign out, the session is deleted from our server and the cookie is cleared from your browser.",
      "This is a strictly necessary cookie: it exists solely to keep you signed in, and the Service cannot function without it. We set no analytics or advertising cookies, and no third party sets cookies through our site. For this reason, no cookie consent banner is shown, as there is nothing optional to consent to.",
      "MeetingWatch stores nothing else in your browser. It does not use local storage, session storage, or any other client-side database. Your information is held on our server.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: ["We use the information described above to operate the Service:"],
    bullets: [
      "To create your account, sign you in, and keep you signed in.",
      "To save your meetings and display your history, trends, and comparisons.",
      "To calculate estimated meeting costs from the wage information you choose to enter.",
      "To generate AI advice when you request it, or when you end a live meeting.",
      "To apply the usage limits included with the Free plan and unlock features on the Premium plan.",
      "To process payment for a Premium subscription and record whether it is active.",
      "To respond to your support enquiries and to keep the Service secure and operational.",
    ],
  },
  {
    title: "Consent, and Withdrawing It",
    body: [
      "We rely on your consent to collect and use your personal information. You provide that consent by creating an account and entering information into the Service. We ask only for what a given feature requires: the Service can be used without entering any wage information and without using the AI features.",
      "You may withdraw your consent at any time by discontinuing use of the Service and requesting deletion of your account. Because your information is what the Service operates on, withdrawing consent means we can no longer provide the Service to you. Withdrawal does not reverse processing that has already taken place, including content already sent to Google as described below.",
    ],
  },
  {
    title: "AI Features and What Is Sent to Google",
    body: [
      "MeetingWatch's AI advice is generated using the Gemini API, a service operated by Google. When you use an AI feature, we send information about your meetings to Google in order to generate a response. What is sent depends on the feature:",
    ],
    bullets: [
      "Ending a live meeting always generates advice, and sends that meeting's title and the full text of its notes to Google as you entered them, together with its duration, your rating and engagement score, whether you marked it as something that could have been an email, and the meeting's total estimated cost.",
      "Requesting advice on a past meeting sends the same information for that meeting. Where advice has already been generated, the stored copy is displayed and nothing is sent.",
      "The advice features on the reports page send only aggregate figures, such as the number of meetings in a period and your averages. They do not send meeting titles or notes.",
      "Logging a meeting manually, viewing your history, and viewing the trend and comparison charts send nothing to Google.",
      "Individual attendee names and individual wage amounts are never sent. Only a meeting's combined total cost, or averages across your meetings, are included.",
      "We do not send your name, email address, or account identifier to Google.",
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
      "MeetingWatch uses the Gemini API on Google's unpaid service tier. Under Google's published terms for that tier, Google uses content submitted to the API and the responses generated from it to provide, improve, and develop Google's products and services, including its AI models. Google's terms further state that human reviewers may read, annotate, and process API input and output, and that Google takes steps to disconnect this content from your account before human review. Once content has been sent, we cannot limit, recall, or reverse Google's use of it.",
      "This applies to all users, on both the Free and Premium plans. A Premium subscription provides unlimited meetings, unlimited attendees, and comparison analytics. It does not change how Google handles content and does not move your content to a different service tier.",
      "Google's terms instruct developers not to submit sensitive, confidential, or personal information to the unpaid tier. You should therefore not enter confidential or sensitive material into meeting titles or notes. This includes client names, personal details about attendees, health information, legal or financial matters, trade secrets, and anything subject to a confidentiality or non-disclosure obligation. We recommend keeping notes general.",
      "The AI features are not required in order to use MeetingWatch. Live tracking, manual logging, cost estimates, history, and the trend and comparison charts all operate without contacting Google. Only ending a live meeting generates advice.",
      "Please note that a meeting's total estimated cost is sent when you end it. For a meeting with a single attendee, that total is that person's wage for the duration of the meeting, and may therefore indicate their pay rate. If this is a concern, do not attach wage information to meetings you intend to end with AI advice.",
    ],
  },
  {
    title: "AI Advice We Store",
    body: [
      "AI-generated advice is stored on the relevant meeting record so that it can be displayed again without being regenerated, which also reduces the number of requests made to Google.",
      "Because the advice is generated in response to a prompt containing the meeting's title and notes, it may repeat parts of them. It is retained and deleted on the same terms as the rest of your meeting information.",
    ],
  },
  {
    title: "Payments and Stripe",
    body: [
      "Premium subscriptions are processed by Stripe. The only personal information MeetingWatch sends to Stripe is your email address. We do not send your name, your meetings, your roster, or any wage information.",
      "Card details are entered on Stripe's hosted checkout pages rather than on ours. Card numbers do not reach MeetingWatch's servers, are not stored by us, and are not accessible to us. The same applies to the billing portal, where you can update your payment method or cancel your subscription.",
      "Stripe collects information directly from you on those pages, which may include your name, billing address, card details, and technical information such as your IP address. Stripe acts as an independent controller for some of this information and processes it under its own privacy policy. When Stripe notifies us that a payment has succeeded or a subscription has ended, we store only a Stripe customer reference, a subscription reference, and whether the account is currently Premium.",
      "Your browser contacts Stripe only if you choose to begin checkout or open the billing portal, at which point you are directed to Stripe's website. Using MeetingWatch without starting a subscription sends nothing to Stripe.",
    ],
    links: [
      { label: "See plans and pricing", href: "/pricing" },
      { label: "Stripe's privacy policy", href: "https://stripe.com/privacy" },
    ],
  },
  {
    title: "Who Else We Share Your Information With",
    body: [
      "We do not disclose your personal information to any third party other than Google and Stripe, as described in the preceding sections. Each receives only the information set out there.",
      "We do not sell your personal information. We do not rent, trade, or share it for advertising purposes, and we do not provide it to data brokers, marketing companies, or analytics providers.",
      "Two exceptions apply. We may disclose information where required by law, for example in response to a valid court order or legal process, and will limit any such disclosure to what is required. If MeetingWatch is transferred to another owner, your information may transfer as part of that transaction; we will give notice if this occurs, and the information will remain subject to a policy no less protective than this one.",
    ],
  },
  {
    title: "Where Your Information Is Stored, and Transfers Outside Canada",
    body: [
      "Your account, meetings, roster, and attendance records are stored in a PostgreSQL database operated from the Province of Ontario, Canada.",
      "Two parts of the Service involve information leaving Canada: content sent to the Gemini API is processed by Google, and payment information is processed by Stripe. Both are United States companies and may process and store information in the United States or in other countries.",
      "While personal information is located in another country, it is subject to the laws of that country and may be accessible to its courts, law enforcement, and regulatory authorities.",
    ],
  },
  {
    title: "How Long We Keep Your Information",
    body: [
      "We retain your account and the information it contains for as long as your account remains open. MeetingWatch has no automatic expiry or scheduled deletion process, so information is not removed on a timer. Meetings recorded two years ago will remain available unless you ask us to delete them.",
      "Signed-in sessions are the exception and are short-lived by design. A session expires 24 hours after you sign in. It is deleted when you sign out, and an expired session is deleted the next time it is presented to us.",
      "We do not commit to deleting inactive accounts on a fixed schedule, as we have not implemented a process capable of carrying that out reliably. We do commit to deleting your information promptly on request, as set out below.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You have the following rights in relation to your personal information. We extend all of them to every user, regardless of location:",
    ],
    bullets: [
      "Access — request a copy of the personal information we hold about you, together with an explanation of how it has been used and to whom it has been disclosed.",
      "Correction — request that inaccurate or incomplete information be corrected. Most information can also be edited directly within the app.",
      "Deletion — request deletion of your account and the information it contains, as described in the next section.",
      "Withdrawal of consent — instruct us to stop processing your information, which requires closing your account.",
      "Complaint — challenge our handling of your information with us and, if the matter remains unresolved, with a regulator.",
    ],
    links: [{ label: "Make a request", href: "/contact" }],
  },
  {
    title: "Deleting Your Account",
    body: [
      "Account deletion is not currently self-service. To have your account deleted, email meeting.watch.support@gmail.com from the address associated with your account. We will action the request within a reasonable period, and in any event within 30 days.",
      "When we delete your account, we remove your account record, your meetings together with their notes and any stored AI advice, your employee roster, the attendee records attached to your meetings, and your signed-in sessions.",
      "Two categories of information cannot be deleted. Content already sent to Google's Gemini API is held by Google under Google's terms and is outside our control. In addition, we and Stripe may be required to retain basic payment and tax records relating to a Premium subscription for as long as the law requires.",
      "If you hold a Premium subscription, please cancel it before requesting deletion, or say so in your email, so that we can ensure billing does not continue.",
    ],
  },
  {
    title: "How We Protect Your Information",
    body: [
      "Passwords are hashed with argon2 and the original is never stored. Signed-in sessions are identified by a 256-bit random value held in a cookie that cannot be read by page scripts and is not sent from other sites, and they expire after 24 hours.",
      "Every database query that reads or writes your information is scoped to your own account, so one user's identifier cannot be used to reach another user's data. Queries are parameterized, and the few places where a column name is selected dynamically accept only values from a fixed internal list. Messages received from Stripe are cryptographically verified before being acted upon, and card details are never received by our servers.",
      "We do not deliberately record personal information in our server logs, although a technical error message may on occasion contain an email address.",
      "No method of transmitting or storing information is completely secure, and we cannot guarantee absolute security. MeetingWatch is an early-stage service operated by one person, which you should take into account when deciding what information to enter. Entering less information, such as initials rather than full names and no wage figures, remains the most effective protection available to you.",
    ],
  },
  {
    title: "If There Is a Data Breach",
    body: [
      "If personal information in our care is lost, accessed without authorization, or disclosed in error, we will investigate promptly and take steps to contain the incident.",
      "Where a breach creates a real risk of significant harm, we will notify affected users as soon as feasible, describing what occurred, what information was involved, what we are doing in response, and what steps you can take. We will report such breaches to the Office of the Privacy Commissioner of Canada as required by Canadian law, and we maintain a record of breaches, including those that do not meet this threshold.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "MeetingWatch is not directed at children under 13, and you must be at least 13 to use it. If you are under the age of majority where you live, which is 18 in Ontario, you may use the Service only with the permission and involvement of a parent or legal guardian. You must be of the age of majority to purchase a Premium subscription.",
      "We do not knowingly collect personal information from children under 13. If we become aware that we have done so, we will delete it. If you are a parent or guardian and believe your child has provided us with information, please contact us and we will remove it.",
    ],
  },
  {
    title: "Automated Decisions",
    body: [
      "We do not use your personal information to make automated decisions producing legal effects or similarly significant effects. No part of the Service approves, ranks, scores, or makes determinations about you without human involvement.",
      "The AI features produce written suggestions for you to review. They are not applied automatically and, as set out in our Terms of Service, do not constitute employment, human resources, legal, financial, or other professional advice. They should not be relied upon in making decisions about any individual's employment, compensation, or performance.",
    ],
    links: [{ label: "See our Terms of Service", href: "/terms" }],
  },
  {
    title: "Links to Other Websites",
    body: [
      "This policy applies to MeetingWatch only. Where the Service links to external sites, including Stripe and Google, those sites are operated by other organizations under their own privacy policies, and we are not responsible for their handling of your information.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this policy as the Service develops or as required by law. The effective date at the top of this page indicates when the current version took effect.",
      "Where we make a material change, for example to the information we collect, the parties we disclose it to, or how the AI features process your content, we will make reasonable efforts to notify you before it takes effect, by email or within the app. Other changes take effect when posted. Where a change requires your consent under applicable law, we will obtain it.",
    ],
  },
  {
    title: "Contact Us, and How to Complain",
    body: [
      "For any question about this policy, to request a copy of your information, to have information corrected, or to have your account deleted, contact meeting.watch.support@gmail.com. The individual who operates MeetingWatch is accountable for personal information handled by the Service and will provide their name and mailing address on request. MeetingWatch is operated from the Province of Ontario, Canada.",
      "If you are not satisfied with how we have handled your personal information, please contact us first so that we have an opportunity to resolve the matter. If it remains unresolved, you have the right to make a complaint to the Office of the Privacy Commissioner of Canada, which asks that concerns be raised with the organization before being brought to them. If you are located outside Canada, you may also have the right to complain to your local privacy regulator.",
    ],
    links: [
      {
        label: "meeting.watch.support@gmail.com",
        href: "mailto:meeting.watch.support@gmail.com",
      },
      {
        label: "Office of the Privacy Commissioner of Canada",
        href: "https://www.priv.gc.ca/en/report-a-concern/",
      },
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">Privacy Policy</h1>
        <p className="text-sm" style={{ color: "#5E7A6F" }}>
          Effective date: September 7, 2026
        </p>
        <p className="mt-6 text-lg" style={{ color: "#DCEAE3" }}>
          This policy explains what information MeetingWatch collects, how it is
          used, and the choices available to you.
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

export default PrivacyPolicy;
