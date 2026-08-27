import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AppLayout from "../components/AppLayout";
import StartMeetingModal from "../components/StartMeetingModal";
import LiveMeetingView from "../components/LiveMeetingView";
import EndMeetingModal from "../components/EndMeetingModal";
import { useMeeting } from "../context/MeetingContext";

type Period = "weekly" | "monthly" | "annually";
type Metric = "count" | "rating" | "engagement" | "length";

type TrendPoint = { period: string; value: string | null };
type ChartPoint = { label: string; value: number | null };
type Employee = {
  id: number;
  wage_amount: string;
  wage_type: "hourly" | "yearly";
};

const METRIC_LABELS: Record<Metric, string> = {
  count: "Number of Meetings",
  rating: "Average Rating",
  engagement: "Average Engagement",
  length: "Average Length (min)",
};

const formatLabel = (isoDate: string, period: Period) => {
  const date = new Date(isoDate);
  if (period === "annually") return date.getFullYear().toString();
  if (period === "monthly")
    return date.toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const Dashboard = () => {
  const { activeMeeting } = useMeeting();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [period, setPeriod] = useState<Period>("weekly");
  const [metric, setMetric] = useState<Metric>("rating");
  const [data, setData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch("http://localhost:4000/api/employees", {
        credentials: "include",
      });
      if (response.ok) setEmployees(await response.json());
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:4000/api/meetings/trends?period=${period}&metric=${metric}`,
          { credentials: "include" },
        );
        if (!response.ok) {
          setError("Could not load report data");
          return;
        }
        const raw: TrendPoint[] = await response.json();
        setData(
          raw.map((point) => ({
            label: formatLabel(point.period, period),
            value: point.value === null ? null : Number(point.value),
          })),
        );
      } catch {
        setError("Could not reach the server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, [period, metric]);

  return (
    <AppLayout activePage="Dashboard">
      {activeMeeting ? (
        <LiveMeetingView
          employees={employees}
          onEndMeeting={() => setShowEndModal(true)}
        />
      ) : (
        <button
          onClick={() => setShowStartModal(true)}
          className="w-full rounded-xl py-6 mb-10 text-lg font-semibold text-black transition-transform cursor-pointer hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
            boxShadow: "0 8px 30px -8px rgba(62,207,142,0.4)",
          }}
        >
          + Start new meeting
        </button>
      )}

      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <h3 className="text-2xl font-semibold text-white">Meeting Reports</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <label
            className="flex items-center gap-2 text-sm"
            style={{ color: "#5E7A6F" }}
          >
            Metric
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              className="rounded-lg px-3 py-2 text-sm bg-transparent border cursor-pointer"
              style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
            >
              <option value="rating" style={{ background: "#0A0F0D" }}>
                Rating
              </option>
              <option value="engagement" style={{ background: "#0A0F0D" }}>
                Engagement
              </option>
              <option value="count" style={{ background: "#0A0F0D" }}>
                Meeting count
              </option>
              <option value="length" style={{ background: "#0A0F0D" }}>
                Length
              </option>
            </select>
          </label>
          <label
            className="flex items-center gap-2 text-sm"
            style={{ color: "#5E7A6F" }}
          >
            Change report to
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="rounded-lg px-3 py-2 text-sm bg-transparent border cursor-pointer"
              style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
            >
              <option value="weekly" style={{ background: "#0A0F0D" }}>
                Weekly
              </option>
              <option value="monthly" style={{ background: "#0A0F0D" }}>
                Monthly
              </option>
              <option value="annually" style={{ background: "#0A0F0D" }}>
                Annually
              </option>
            </select>
          </label>
        </div>
      </div>

      <p
        className="text-xs uppercase tracking-[0.15em] mb-6"
        style={{ color: "#5E7A6F" }}
      >
        {period}
      </p>

      {isLoading && <p style={{ color: "#5E7A6F" }}>Loading report...</p>}
      {error && <p style={{ color: "#E0574C" }}>{error}</p>}
      {!isLoading && !error && data.length === 0 && (
        <p style={{ color: "#5E7A6F" }}>
          No meetings logged yet — start one above to see your trend here.
        </p>
      )}

      {!isLoading && !error && data.length > 0 && (
        <div
          className="rounded-xl border p-6 mb-10"
          style={{ borderColor: "rgba(62,207,142,0.18)" }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(62,207,142,0.12)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#5E7A6F"
                tick={{ fill: "#5E7A6F", fontSize: 12 }}
                axisLine={{ stroke: "rgba(62,207,142,0.18)" }}
                tickLine={false}
              />
              <YAxis
                stroke="#5E7A6F"
                tick={{ fill: "#5E7A6F", fontSize: 12 }}
                axisLine={{ stroke: "rgba(62,207,142,0.18)" }}
                tickLine={false}
                label={{
                  value: METRIC_LABELS[metric],
                  angle: -90,
                  position: "insideLeft",
                  fill: "#5E7A6F",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "#0A0F0D",
                  border: "1px solid rgba(62,207,142,0.3)",
                  borderRadius: "8px",
                  color: "#DCEAE3",
                }}
                labelStyle={{ color: "#5E7A6F" }}
                formatter={(value) => (value == null ? "No data" : value)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3ECF8E"
                strokeWidth={2.5}
                dot={{ fill: "#3ECF8E", r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showStartModal && (
        <StartMeetingModal onClose={() => setShowStartModal(false)} />
      )}
      {showEndModal && activeMeeting && (
        <EndMeetingModal
          meetingId={activeMeeting.id}
          onClose={() => setShowEndModal(false)}
        />
      )}
    </AppLayout>
  );
};

export default Dashboard;
