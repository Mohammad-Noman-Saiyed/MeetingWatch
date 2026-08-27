import { useState, useEffect } from "react";
import { useMeeting } from "../context/MeetingContext";

type Employee = {
  id: number;
  wage_amount: string;
  wage_type: "hourly" | "yearly";
};

type LiveMeetingViewProps = {
  employees: Employee[]; // full roster, used to look up attendees' wages
  onEndMeeting: () => void;
};

const formatElapsed = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
};

const LiveMeetingView = ({ employees, onEndMeeting }: LiveMeetingViewProps) => {
  const { activeMeeting } = useMeeting();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeMeeting) return;

    const startedAtMs = new Date(activeMeeting.startedAt).getTime();

    const tick = () => {
      setElapsedSeconds((Date.now() - startedAtMs) / 1000);
    };

    tick(); // set the correct value immediately, don't wait a full second for the first tick
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [activeMeeting]);

  if (!activeMeeting) return null;

  const costPerSecond = activeMeeting.attendeeIds.reduce((total, id) => {
    const employee = employees.find((e) => e.id === id);
    if (!employee) return total;
    const amount = Number(employee.wage_amount);
    const rate =
      employee.wage_type === "hourly" ? amount / 3600 : amount / (2080 * 3600);
    return total + rate;
  }, 0);

  const currentCost = costPerSecond * elapsedSeconds;

  return (
    <div
      className="rounded-xl border p-8 text-center mb-10"
      style={{
        borderColor: "rgba(62,207,142,0.3)",
        background: "rgba(62,207,142,0.04)",
      }}
    >
      <p
        className="text-xs uppercase tracking-[0.2em] mb-2"
        style={{ color: "#5E7A6F" }}
      >
        In progress
      </p>
      <h3 className="text-xl font-semibold text-white mb-6">
        {activeMeeting.title}
      </h3>

      <p
        className="text-5xl font-semibold mb-2"
        style={{ color: "#3ECF8E", fontFamily: "monospace" }}
      >
        {formatElapsed(elapsedSeconds)}
      </p>

      <p
        className="text-2xl mb-8"
        style={{ color: "#DCEAE3", fontFamily: "monospace" }}
      >
        ${currentCost.toFixed(2)}
      </p>

      <button
        onClick={onEndMeeting}
        className="rounded-lg px-8 py-3 text-sm font-semibold text-white cursor-pointer"
        style={{ background: "#E0574C" }}
      >
        End Meeting
      </button>
    </div>
  );
};

export default LiveMeetingView;
