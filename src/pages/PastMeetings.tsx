import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";

type Meeting = {
  id: number;
  title: string;
  meeting_date: string;
  duration_minutes: number | null;
  status: string;
};

const PastMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/meetings", {
          credentials: "include",
        });

        if (!response.ok) {
          setError("Could not load meetings");
          return;
        }

        const data = await response.json();
        setMeetings(data);
      } catch (err) {
        setError("Could not reach the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  return (
    <AppLayout activePage="Past Meetings">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-xl font-semibold text-white">Past meetings</h3>
        <span className="text-xs" style={{ color: "#EEEEEE" }}>
          {meetings.length} logged
        </span>
      </div>

      {isLoading && <p style={{ color: "#5E7A6F" }}>Loading meetings...</p>}
      {error && <p style={{ color: "#E0574C" }}>{error}</p>}
      {!isLoading && !error && meetings.length === 0 && (
        <p style={{ color: "#5E7A6F" }}>
          No meetings logged yet — start one above.
        </p>
      )}

      {!isLoading && !error && meetings.length > 0 && (
        <div
          className="rounded-xl overflow-x-auto border"
          style={{ borderColor: "rgba(62,207,142,0.18)" }}
        >
          <table className="w-full min-w-150 border-collapse text-sm">
            <thead>
              <tr
                className="text-left"
                style={{
                  color: "#EEEEEE",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                }}
              >
                <th className="py-3 px-5 font-normal uppercase w-14"> </th>
                <th className="py-3 px-5 font-normal uppercase">
                  Meeting title
                </th>
                <th className="py-3 px-5 font-normal uppercase">
                  Date created
                </th>
                <th className="py-3 px-5 font-normal uppercase">AI advice</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, i) => {
                const selected = selectedIds.includes(meeting.id);
                return (
                  <tr
                    key={meeting.id}
                    className="transition-colors hover:bg-white/3"
                    style={{
                      borderTop: "1px solid rgba(62,207,142,0.12)",
                      background:
                        i % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent",
                    }}
                  >
                    <td className="py-4 px-5">
                      <button
                        onClick={() => toggleSelected(meeting.id)}
                        aria-pressed={selected}
                        aria-label={`Select ${meeting.title}`}
                        className="w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer"
                        style={{
                          borderColor: selected
                            ? "#3ECF8E"
                            : "rgba(94,122,111,0.5)",
                          background: selected ? "#3ECF8E" : "transparent",
                        }}
                      >
                        {selected && (
                          <span className="text-black text-xs leading-none font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-[#DCEAE3] font-medium">
                      {meeting.title}
                    </td>
                    <td className="py-4 px-5" style={{ color: "#5E7A6F" }}>
                      {new Date(meeting.meeting_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5">
                      <button
                        className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border hover:bg-white/5"
                        style={{
                          borderColor: "rgba(62,207,142,0.4)",
                          color: "#3ECF8E",
                        }}
                      >
                        See AI advice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
};

export default PastMeetings;
