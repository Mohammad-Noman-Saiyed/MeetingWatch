import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const FREE_FEATURES = [
  "1 meeting per 24 hours",
  "Up to 3 attendees per meeting",
  "Live tracking and manual logging",
  "AI advice on every meeting",
  "Trend reports over time",
];

const PREMIUM_FEATURES = [
  "Unlimited meetings",
  "Unlimited attendees per meeting",
  "Comparison analytics on any two metrics",
  "Everything in Free",
];

const Pricing = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const me = await response.json();
        setIsLoggedIn(true);
        setIsPremium(me.isPremium);
      }
    };
    fetchMe();
  }, []);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/api/billing/checkout`,
        { method: "POST", credentials: "include" },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/billing/portal`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0F0D" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-bold text-white text-4xl py-4">Pricing</h1>
        <p className="text-xl mb-10" style={{ color: "#DCEAE3" }}>
          Track your meetings and make them more efficient. Start free, upgrade
          when you need more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free plan */}
          <div
            className="rounded-xl border p-6 flex flex-col"
            style={{ borderColor: "rgba(62,207,142,0.18)" }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white">Free</h2>
              {isLoggedIn && !isPremium && (
                <span
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: "#5E7A6F" }}
                >
                  Current plan
                </span>
              )}
            </div>

            <p className="mt-4 text-3xl font-bold text-white">
              CA$0
              <span
                className="text-sm font-medium"
                style={{ color: "#5E7A6F" }}
              >
                {" "}
                / month
              </span>
            </p>

            <div className="flex flex-col gap-3 mt-6 mb-8">
              {FREE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#5E7A6F" }}
                  />
                  <span className="text-sm" style={{ color: "#DCEAE3" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {isLoggedIn ? (
                <p className="text-sm" style={{ color: "#5E7A6F" }}>
                  {isPremium
                    ? "You've upgraded past this plan."
                    : "You're on this plan."}
                </p>
              ) : (
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-center cursor-pointer transition-colors"
                  style={{
                    color: "#DCEAE3",
                    border: "1px solid rgba(62,207,142,0.4)",
                  }}
                >
                  Get started
                </button>
              )}
            </div>
          </div>

          {/* Premium plan */}
          <div
            className="rounded-xl border p-6 flex flex-col"
            style={{ borderColor: "rgba(62,207,142,0.4)" }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white">Premium</h2>
              {isPremium && (
                <span
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: "#3ECF8E" }}
                >
                  Current plan
                </span>
              )}
            </div>

            <p className="mt-4 text-3xl font-bold text-white">
              CA$5
              <span
                className="text-sm font-medium"
                style={{ color: "#5E7A6F" }}
              >
                {" "}
                / month
              </span>
            </p>

            <div className="flex flex-col gap-3 mt-6 mb-8">
              {PREMIUM_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#3ECF8E" }}
                  />
                  <span className="text-sm" style={{ color: "#DCEAE3" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {!isLoggedIn && (
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-center text-black cursor-pointer transition-transform hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
                    boxShadow: "0 4px 16px -4px rgba(62,207,142,0.4)",
                  }}
                >
                  Sign up to upgrade
                </button>
              )}

              {isLoggedIn && !isPremium && (
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-center text-black cursor-pointer transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
                    boxShadow: "0 4px 16px -4px rgba(62,207,142,0.4)",
                  }}
                >
                  {isLoading ? "Starting checkout..." : "Upgrade to Premium"}
                </button>
              )}

              {isLoggedIn && isPremium && (
                <button
                  onClick={handleManage}
                  disabled={isLoading}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: "#DCEAE3",
                    border: "1px solid rgba(62,207,142,0.4)",
                  }}
                >
                  {isLoading ? "Opening..." : "Manage subscription"}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-6 text-sm" style={{ color: "#E0574C" }}>
            {error}
          </p>
        )}

        <p className="mt-10 text-sm" style={{ color: "#5E7A6F" }}>
          Cancel anytime from the billing portal. Attendee wages are optional —
          add them only if you want to track meeting cost.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
