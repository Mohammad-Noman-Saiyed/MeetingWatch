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
import ComparisonChart from "../components/ComparisonChart";
import StartMeetingModal from "../components/StartMeetingModal";
import LiveMeetingView from "../components/LiveMeetingView";
import EndMeetingModal from "../components/EndMeetingModal";
import { useMeeting } from "../context/MeetingContext";

type Period = "weekly" | "monthly" | "annually";
type Metric = "count" | "rating" | "engagement" | "length" | "cost";
type ComparisonMetric = "rating" | "engagement" | "length" | "cost";
type ActiveView = "trend" | "comparison";

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
  cost: "Average Cost ($)",
};

const COMPARISON_METRIC_LABELS: Record<ComparisonMetric, string> = {
  rating: "Overall Rating",
  engagement: "Engagement Score",
  length: "Duration (min)",
  cost: "Cost ($)",
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

  const [activeView, setActiveView] = useState<ActiveView>("trend");

  const [period, setPeriod] = useState<Period>("weekly");
  const [metric, setMetric] = useState<Metric>("rating");
  const [data, setData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [xMetric, setXMetric] = useState<ComparisonMetric>("rating");
  const [yMetric, setYMetric] = useState<ComparisonMetric>("length");
  const [comparisonData, setComparisonData] = useState<{ x: number; y: number }[]>([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [adviceStale, setAdviceStale] = useState(true);
  const [advice, setAdvice] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);

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

  useEffect(() => {
    if (activeView !== "comparison") return;

    const fetchComparison = async () => {
      setComparisonLoading(true);
      setComparisonError("");
      setAdviceStale(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/meetings/comparison?xMetric=${xMetric}&yMetric=${yMetric}`,
          { credentials: "include" },
        );
        if (!response.ok) {
          setComparisonError("Could not load comparison data");
          return;
        }
        const raw = await response.json();
        setComparisonData(raw);
      } catch {
        setComparisonError("Could not reach the server");
      } finally {
        setComparisonLoading(false);
      }
    };
    fetchComparison();
  }, [activeView, xMetric, yMetric]);

  const handleAskAdvice = async () => {
    setAdviceLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/meetings/comparison/advice?xMetric=${xMetric}&yMetric=${yMetric}`,
        { credentials: "include" },
      );
      if (!response.ok) return;
      const raw = await response.json();
      setAdvice(raw.advice);
      setAdviceStale(false);
    } finally {
      setAdviceLoading(false);
    }
  };

  return (
    <AppLayout activePage="Dashboard">
      {(isPremium: boolean) => (
      <>
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
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-white">Meeting Reports</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("trend")}
              className={`px-3 py-1 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                activeView === "trend"
                  ? "bg-emerald-600 text-white"
                  : "bg-transparent border text-gray-400 hover:text-white"
              }`}
              style={{
                borderColor:
                  activeView === "trend"
                    ? "transparent"
                    : "rgba(62,207,142,0.4)",
              }}
            >
              Trend
            </button>
            <button
              onClick={() => isPremium && setActiveView("comparison")}
              disabled={!isPremium}
              title={
                isPremium ? undefined : "Comparison charts are a premium feature"
              }
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                !isPremium
                  ? "bg-transparent border text-gray-600 cursor-not-allowed"
                  : activeView === "comparison"
                  ? "bg-emerald-600 text-white cursor-pointer"
                  : "bg-transparent border text-gray-400 hover:text-white cursor-pointer"
              }`}
              style={{
                borderColor:
                  isPremium && activeView === "comparison"
                    ? "transparent"
                    : "rgba(62,207,142,0.4)",
              }}
            >
              Comparison
            </button>
          </div>
          {!isPremium && (
            <span className="text-xs" style={{ color: "#5E7A6F" }}>
              Comparison charts are a premium feature
            </span>
          )}
        </div>
        {activeView === "trend" ? (
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
                style={{
                  borderColor: "rgba(62,207,142,0.4)",
                  color: "#DCEAE3",
                }}
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
                style={{
                  borderColor: "rgba(62,207,142,0.4)",
                  color: "#DCEAE3",
                }}
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
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <label
              className="flex items-center gap-2 text-sm"
              style={{ color: "#5E7A6F" }}
            >
              X-axis
              <select
                value={xMetric}
                onChange={(e) => setXMetric(e.target.value as ComparisonMetric)}
                className="rounded-lg px-3 py-2 text-sm bg-transparent border cursor-pointer"
                style={{
                  borderColor: "rgba(62,207,142,0.4)",
                  color: "#DCEAE3",
                }}
              >
                <option value="rating" style={{ background: "#0A0F0D" }}>
                  Rating
                </option>
                <option value="engagement" style={{ background: "#0A0F0D" }}>
                  Engagement
                </option>
                <option value="length" style={{ background: "#0A0F0D" }}>
                  Length
                </option>
                <option value="cost" style={{ background: "#0A0F0D" }}>
                  Cost
                </option>
              </select>
            </label>
            <label
              className="flex items-center gap-2 text-sm"
              style={{ color: "#5E7A6F" }}
            >
              Y-axis
              <select
                value={yMetric}
                onChange={(e) => setYMetric(e.target.value as ComparisonMetric)}
                className="rounded-lg px-3 py-2 text-sm bg-transparent border cursor-pointer"
                style={{
                  borderColor: "rgba(62,207,142,0.4)",
                  color: "#DCEAE3",
                }}
              >
                <option value="rating" style={{ background: "#0A0F0D" }}>
                  Rating
                </option>
                <option value="engagement" style={{ background: "#0A0F0D" }}>
                  Engagement
                </option>
                <option value="length" style={{ background: "#0A0F0D" }}>
                  Length
                </option>
                <option value="cost" style={{ background: "#0A0F0D" }}>
                  Cost
                </option>
              </select>
            </label>
          </div>
        )}
      </div>

      {activeView === "trend" && (
        <p
          className="text-xs uppercase tracking-[0.15em] mb-6"
          style={{ color: "#5E7A6F" }}
        >
          {period}
        </p>
      )}

      {activeView === "trend" && isLoading && (
        <p style={{ color: "#5E7A6F" }}>Loading report...</p>
      )}
      {activeView === "trend" && error && (
        <p style={{ color: "#E0574C" }}>{error}</p>
      )}
      {activeView === "trend" && !isLoading && !error && data.length === 0 && (
        <p style={{ color: "#5E7A6F" }}>
          No meetings logged yet — start one above to see your trend here.
        </p>
      )}

      {activeView === "trend" && !isLoading && !error && data.length > 0 && (
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

      {activeView === "comparison" && comparisonLoading && (
        <p style={{ color: "#5E7A6F" }}>Loading comparison...</p>
      )}
      {activeView === "comparison" && comparisonError && (
        <p style={{ color: "#E0574C" }}>{comparisonError}</p>
      )}
      {activeView === "comparison" &&
        !comparisonLoading &&
        !comparisonError &&
        comparisonData.length === 0 && (
          <p style={{ color: "#5E7A6F" }}>
            No meetings with both metrics logged yet.
          </p>
        )}

      {activeView === "comparison" &&
        !comparisonLoading &&
        !comparisonError &&
        comparisonData.length > 0 && (
          <>
            <ComparisonChart
              data={comparisonData}
              xLabel={COMPARISON_METRIC_LABELS[xMetric]}
              yLabel={COMPARISON_METRIC_LABELS[yMetric]}
            />
            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={handleAskAdvice}
                disabled={!isPremium || adviceLoading}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
                }}
              >
                {adviceLoading ? "Asking AI..." : "Ask AI for Advice"}
              </button>
              {advice && (
                <p
                  className="text-sm"
                  style={{ color: adviceStale ? "#5E7A6F" : "#DCEAE3" }}
                >
                  {adviceStale ? "(based on previous selection) " : ""}
                  {advice}
                </p>
              )}
            </div>
          </>
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
      </>
      )}
    </AppLayout>
  );
};

export default Dashboard;
