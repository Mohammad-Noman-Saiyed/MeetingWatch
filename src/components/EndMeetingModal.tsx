import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "../context/MeetingContext";

type EndMeetingModalProps = {
  meetingId: number;
  onClose: () => void;
};

type EndResult = {
  finalCost: string;
  duration_minutes: number;
  advice: string;
};

const EndMeetingModal = ({ meetingId, onClose }: EndMeetingModalProps) => {
  const navigate = useNavigate();
  const { setActiveMeeting } = useMeeting();

  const [notes, setNotes] = useState("");
  const [overallRating, setOverallRating] = useState(3);
  const [engagementScore, setEngagementScore] = useState(5);
  const [couldBeEmail, setCouldBeEmail] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EndResult | null>(null);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/meetings/${meetingId}/end`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            notes,
            overallRating,
            engagementScore,
            couldBeEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not end meeting");
        return;
      }

      setResult(data);
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    setActiveMeeting(null); // clear the active meeting — the "in progress" state is over
    onClose();
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className="w-full max-w-md rounded-xl border p-6"
        style={{ background: "#0A0F0D", borderColor: "rgba(62,207,142,0.3)" }}
      >
        {!result ? (
          <>
            <h3 className="text-lg font-semibold text-white mb-4">
              Wrap up this meeting
            </h3>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-xs" style={{ color: "#5E7A6F" }}>
                Notes
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="rounded-lg px-3 py-2 text-sm bg-transparent border resize-none"
                style={{
                  borderColor: "rgba(62,207,142,0.4)",
                  color: "#DCEAE3",
                }}
              />
            </label>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-xs" style={{ color: "#5E7A6F" }}>
                Overall rating: {overallRating} / 5
              </span>
              <input
                type="range"
                min={1}
                max={5}
                value={overallRating}
                onChange={(e) => setOverallRating(Number(e.target.value))}
                className="cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-xs" style={{ color: "#5E7A6F" }}>
                Engagement: {engagementScore} / 10
              </span>
              <input
                type="range"
                min={1}
                max={10}
                value={engagementScore}
                onChange={(e) => setEngagementScore(Number(e.target.value))}
                className="cursor-pointer"
              />
            </label>

            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={couldBeEmail}
                onChange={(e) => setCouldBeEmail(e.target.checked)}
                className="cursor-pointer"
              />
              <span className="text-sm" style={{ color: "#DCEAE3" }}>
                Could this have been an email?
              </span>
            </label>

            {error && (
              <p className="text-sm mb-3" style={{ color: "#E0574C" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-lg py-3 text-sm font-semibold text-black cursor-pointer disabled:opacity-50"
              style={{ background: "#3ECF8E" }}
            >
              {isSubmitting ? "Generating advice..." : "Get AI advice"}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-white mb-1">
              Meeting complete
            </h3>
            <p className="text-sm mb-4" style={{ color: "#5E7A6F" }}>
              {result.duration_minutes} min · ${result.finalCost}
            </p>

            <div
              className="rounded-lg border p-4 mb-5 text-sm leading-relaxed"
              style={{ borderColor: "rgba(62,207,142,0.3)", color: "#DCEAE3" }}
            >
              {result.advice}
            </div>

            <button
              onClick={handleComplete}
              className="w-full rounded-lg py-3 text-sm font-semibold text-black cursor-pointer"
              style={{ background: "#3ECF8E" }}
            >
              Record and complete this meeting
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EndMeetingModal;
