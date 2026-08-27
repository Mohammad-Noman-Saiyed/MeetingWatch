import { useState } from "react";

type Meeting = {
  id: number;
  title: string;
  meeting_date: string;
  duration_minutes: number | null;
  status: string;
};

type LogMeetingModalProps = {
  onClose: () => void;
  onMeetingLogged: (newMeeting: Meeting) => void; // hands back the full re-fetched list
};

const LogMeetingModal = ({
  onClose,
  onMeetingLogged,
}: LogMeetingModalProps) => {
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [overallRating, setOverallRating] = useState(3);
  const [engagementScore, setEngagementScore] = useState(5);
  const [couldBeEmail, setCouldBeEmail] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !meetingDate) {
      setError("Title and date are required");
      return;
    }

    setIsSubmitting(true);
    const t0 = performance.now();

    try {
      // Step 1: create the meeting
      const createResponse = await fetch("http://localhost:4000/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          meetingDate,
          durationMinutes: durationMinutes ? Number(durationMinutes) : null,
          notes,
          overallRating,
          engagementScore,
          couldBeEmail,
        }),
      });

      if (!createResponse.ok) {
        const data = await createResponse.json();
        setError(data.error || "Could not log meeting");
        return;
      }

      // re-fetch the entire list from the server
      const listResponse = await fetch("http://localhost:4000/api/meetings", {
        credentials: "include",
      });
      const freshList = await listResponse.json();

      const t1 = performance.now();
      console.log(
        `[NAIVE] Log meeting (POST + GET) total time: ${(t1 - t0).toFixed(1)}ms`,
      );

      onMeetingLogged(freshList);
      onClose();
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className="w-full max-w-md rounded-xl border p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: "#0A0F0D", borderColor: "rgba(62,207,142,0.3)" }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Log a past meeting
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs" style={{ color: "#5E7A6F" }}>
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-transparent border"
              style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs" style={{ color: "#5E7A6F" }}>
              Date & time
            </span>
            <input
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-transparent border"
              style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs" style={{ color: "#5E7A6F" }}>
              Duration (minutes)
            </span>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-transparent border"
              style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs" style={{ color: "#5E7A6F" }}>
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-lg px-3 py-2 text-sm bg-transparent border resize-none"
              style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
            />
          </label>

          <label className="flex flex-col gap-1">
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

          <label className="flex flex-col gap-1">
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

          <label className="flex items-center gap-2 cursor-pointer">
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
            <p className="text-sm" style={{ color: "#E0574C" }}>
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm cursor-pointer"
              style={{ color: "#5E7A6F" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-5 py-2 text-sm font-semibold text-black cursor-pointer disabled:opacity-50"
              style={{ background: "#3ECF8E" }}
            >
              {isSubmitting ? "Saving..." : "Log meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogMeetingModal;
