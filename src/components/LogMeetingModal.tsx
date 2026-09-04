import { useState } from "react";
import { useEffect } from "react";

type Meeting = {
  id: number;
  title: string;
  meeting_date: string;
  duration_minutes: number | null;
  status: string;
};

type Employee = {
  id: number;
  name: string;
  wage_amount: string;
  wage_type: "hourly" | "yearly";
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

  const [quickAddName, setQuickAddName] = useState("");
  const [quickAddWage, setQuickAddWage] = useState("");
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [quickAddWageType, setQuickAddWageType] = useState<"hourly" | "yearly">(
    "hourly",
  );
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const response = await fetch("http://localhost:4000/api/employees", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleAttendee = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleQuickAdd = async () => {
    setIsQuickAdding(true);
    try {
      const response = await fetch("http://localhost:4000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: quickAddName,
          wageAmount: quickAddWage,
          wageType: quickAddWageType,
        }),
      });
      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees((prev) => [...prev, newEmployee]);
        setSelectedIds((prev) => [...prev, newEmployee.id]);
        setQuickAddName("");
        setQuickAddWage("");
      }
    } finally {
      setIsQuickAdding(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!title || !meetingDate) {
      setError("Title and date are required");
      return;
    }

    setIsSubmitting(true);

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
          attendeeIds: selectedIds,
        }),
      });

      if (!createResponse.ok) {
        const data = await createResponse.json();
        setError(data.error || "Could not log meeting");
        return;
      }
      const newlyAddedMeeting = await createResponse.json();

      onMeetingLogged(newlyAddedMeeting);
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

        <label className="flex flex-col gap-1 pb-3">
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

        <label className="flex flex-col gap-1 py-3">
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

        <label className="flex flex-col gap-1 py-3">
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

        <label className="flex flex-col gap-1 py-3">
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

        <label className="flex flex-col gap-1 py-3">
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

        <label className="flex flex-col gap-1 py-3">
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

        <label className="flex items-center gap-2 cursor-pointer py-3">
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

        <h5 className="pt-4 text-xs mb-2" style={{ color: "#5E7A6F" }}>
          Attendees
        </h5>

        {isLoadingEmployees && (
          <p className="text-sm mb-3" style={{ color: "#5E7A6F" }}>
            Loading employees...
          </p>
        )}

        {!isLoadingEmployees && employees.length === 0 && (
          <p className="text-sm mb-3" style={{ color: "#5E7A6F" }}>
            No employees yet — add one below.
          </p>
        )}

        {!isLoadingEmployees && employees.length > 0 && (
          <div className="flex flex-col gap-1 mb-4 max-h-40 overflow-y-auto">
            {employees.map((employee) => (
              <label
                key={employee.id}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(employee.id)}
                  onChange={() => toggleAttendee(employee.id)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-[#DCEAE3]">{employee.name}</span>
                <span className="text-xs ml-auto" style={{ color: "#5E7A6F" }}>
                  ${employee.wage_amount}/{employee.wage_type}
                </span>
              </label>
            ))}
          </div>
        )}

        <input
          type="text"
          value={quickAddName}
          onChange={(e) => setQuickAddName(e.target.value)}
          placeholder="New employee name"
          className="rounded-lg px-2 py-1.5 text-xs bg-transparent border flex-1 min-w-24"
          style={{
            borderColor: "rgba(94,122,111,0.4)",
            color: "#DCEAE3",
          }}
        />
        <input
          type="number"
          value={quickAddWage}
          onChange={(e) => setQuickAddWage(e.target.value)}
          placeholder="Wage"
          className="rounded-lg px-2 py-1.5 text-xs bg-transparent border w-20"
          style={{
            borderColor: "rgba(94,122,111,0.4)",
            color: "#DCEAE3",
          }}
        />
        <select
          value={quickAddWageType}
          onChange={(e) =>
            setQuickAddWageType(e.target.value as "hourly" | "yearly")
          }
          className="rounded-lg px-2 py-1.5 text-xs bg-transparent border cursor-pointer"
          style={{
            borderColor: "rgba(94,122,111,0.4)",
            color: "#DCEAE3",
          }}
        >
          <option value="hourly" style={{ background: "#0A0F0D" }}>
            Hourly
          </option>
          <option value="yearly" style={{ background: "#0A0F0D" }}>
            Yearly
          </option>
        </select>
        <button
          type="submit"
          disabled={isQuickAdding || !quickAddName || !quickAddWage}
          onClick={handleQuickAdd}
          className="rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer border disabled:opacity-50"
          style={{
            borderColor: "rgba(62,207,142,0.4)",
            color: "#3ECF8E",
          }}
        >
          + Add
        </button>
        <div className="flex justify-end gap-3 pt-5">
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-black cursor-pointer disabled:opacity-50"
            style={{ background: "#3ECF8E" }}
          >
            {isSubmitting ? "Saving..." : "Log meeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogMeetingModal;
