import { useState, useEffect } from "react";
import { useMeeting } from "../context/MeetingContext";

type Employee = {
  id: number;
  name: string;
  wage_amount: string;
  wage_type: "hourly" | "yearly";
};

type StartMeetingModalProps = {
  onClose: () => void;
};

const StartMeetingModal = ({ onClose }: StartMeetingModalProps) => {
  const { setActiveMeeting } = useMeeting();

  const [title, setTitle] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  const [quickAddName, setQuickAddName] = useState("");
  const [quickAddWage, setQuickAddWage] = useState("");
  const [quickAddWageType, setQuickAddWageType] = useState<"hourly" | "yearly">(
    "hourly",
  );
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

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

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleBegin = async () => {
    setError("");
    if (!title.trim()) {
      setError("Meeting title is required");
      return;
    }

    setIsStarting(true);
    try {
      const response = await fetch("http://localhost:4000/api/meetings/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, attendeeIds: selectedIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not start meeting");
        return;
      }

      setActiveMeeting({
        id: data.id,
        title: data.title,
        startedAt: data.started_at,
        attendeeIds: selectedIds,
      });
      onClose();
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className="w-full max-w-md rounded-xl border p-6"
        style={{ background: "#0A0F0D", borderColor: "rgba(62,207,142,0.3)" }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Start a new meeting
        </h3>

        <label className="flex flex-col gap-1 mb-5">
          <span className="text-xs" style={{ color: "#5E7A6F" }}>
            Meeting title
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Sync"
            className="rounded-lg px-3 py-2 text-sm bg-transparent border"
            style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
          />
        </label>

        <p className="text-xs mb-2" style={{ color: "#5E7A6F" }}>
          Attendees
        </p>

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

        <form
          onSubmit={handleQuickAdd}
          className="flex flex-wrap gap-2 mb-5 items-end"
        >
          <input
            type="text"
            value={quickAddName}
            onChange={(e) => setQuickAddName(e.target.value)}
            placeholder="New employee name"
            className="rounded-lg px-2 py-1.5 text-xs bg-transparent border flex-1 min-w-24"
            style={{ borderColor: "rgba(94,122,111,0.4)", color: "#DCEAE3" }}
          />
          <input
            type="number"
            value={quickAddWage}
            onChange={(e) => setQuickAddWage(e.target.value)}
            placeholder="Wage"
            className="rounded-lg px-2 py-1.5 text-xs bg-transparent border w-20"
            style={{ borderColor: "rgba(94,122,111,0.4)", color: "#DCEAE3" }}
          />
          <select
            value={quickAddWageType}
            onChange={(e) =>
              setQuickAddWageType(e.target.value as "hourly" | "yearly")
            }
            className="rounded-lg px-2 py-1.5 text-xs bg-transparent border cursor-pointer"
            style={{ borderColor: "rgba(94,122,111,0.4)", color: "#DCEAE3" }}
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
            className="rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer border disabled:opacity-50"
            style={{ borderColor: "rgba(62,207,142,0.4)", color: "#3ECF8E" }}
          >
            + Add
          </button>
        </form>

        {error && (
          <p className="text-sm mb-3" style={{ color: "#E0574C" }}>
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm cursor-pointer"
            style={{ color: "#5E7A6F" }}
          >
            Cancel
          </button>
          <button
            onClick={handleBegin}
            disabled={isStarting}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-black cursor-pointer disabled:opacity-50"
            style={{ background: "#3ECF8E" }}
          >
            {isStarting ? "Starting..." : "Begin Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMeetingModal;
