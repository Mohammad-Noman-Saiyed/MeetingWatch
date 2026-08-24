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

type Period = "weekly" | "monthly" | "annually";
type Metric = "count" | "rating" | "engagement" | "length";

type TrendPoint = {
  period: string;
  value: string | null;
};

type ChartPoint = {
  label: string;
  value: number | null;
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
  const [period, setPeriod] = useState<Period>("weekly");
  const [metric, setMetric] = useState<Metric>("rating");
  const [data, setData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Chart Trends
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
        const points: ChartPoint[] = raw.map((point) => ({
          label: formatLabel(point.period, period),
          value: point.value === null ? null : Number(point.value),
        }));
        setData(points);
      } catch (err) {
        setError("Could not reach the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, [period, metric]);

  // Advice States
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState("");
  const [textAdvice, setTextAdvice] = useState("");
  const [lastAdvicePeriod, setLastAdvicePeriod] = useState<Period | null>(null);

  // Handle AI Advice Logic
  const handleGetAdvice = async (targetPeriod: Period) => {
    try {
      setIsAdviceLoading(true);
      setAdviceError("");

      const adviceResponse = await fetch(
        `http://localhost:4000/api/meetings/advice-summary?period=${targetPeriod}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const adviceData = await adviceResponse.json();

      if (!adviceResponse.ok) {
        setAdviceError(
          adviceData.error || "Something went wrong. Please try again.",
        );
        return;
      }

      setTextAdvice(adviceData.advice);
      setLastAdvicePeriod(targetPeriod); // Lock in what period this advice is for
    } catch (err) {
      setAdviceError("Could not reach the server to get advice.");
    } finally {
      setIsAdviceLoading(false);
    }
  };

  // Auto-load weekly advice on the very first render
  useEffect(() => {
    handleGetAdvice("weekly");
  }, []);

  // Determine button state based on dropdown vs active advice
  const buttonRequiresUpdate = lastAdvicePeriod && lastAdvicePeriod !== period;

  return (
    <AppLayout activePage="Dashboard">
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

      {/* AI Advice Section */}
      <div
        className="flex flex-col items-start gap-4 mb-10 border-t pt-8"
        style={{ borderColor: "rgba(62,207,142,0.18)" }}
      >
        <button
          className={`cursor-pointer px-6 py-3 w-full font-semibold rounded-lg transition-all border-2 disabled:opacity-50
            ${
              buttonRequiresUpdate
                ? "bg-transparent text-pink-400 border-pink-400/50 hover:bg-pink-400/10"
                : "bg-pink-500 text-white border-pink-500 hover:bg-pink-400"
            }`}
          onClick={() => handleGetAdvice(period)}
          disabled={isAdviceLoading}
        >
          {isAdviceLoading
            ? "Generating..."
            : buttonRequiresUpdate
              ? `Update AI Advice for ${period} view`
              : "Ask AI for specific advice"}
        </button>

        {adviceError && <p style={{ color: "#E0574C" }}>{adviceError}</p>}

        {!isAdviceLoading && textAdvice && !buttonRequiresUpdate && (
          <div
            className="font-mono rounded-xl p-6 w-full mt-2"
            // whitespace-pre-wrap ensures the AI's newlines render properly
            style={{
              background: "rgba(236,72,153,0.05)",
              border: "1px solid rgba(236,72,153,0.2)",
              color: "#DCEAE3",
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              
            }}
          >
            {textAdvice}
          </div>
        )}
      </div>
    </AppLayout>
  );
};;

export default Dashboard;
