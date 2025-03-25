import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  fetchCompletionStats,
  fetchAnswerStats,
  fetchAverageTime,
} from "../api/statisticsApi";
import { CompletionEntry, QuestionAnswerStat } from "../interfaces";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#c084fc", "#38bdf8"];

const StatisticsPage = () => {
  const { id } = useParams();
  const [completions, setCompletions] = useState<CompletionEntry[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswerStat[]>([]);
  const [avgTime, setAvgTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadStats = async () => {
      try {
        const [completionRes, answerRes, avgTimeRes] = await Promise.all([
          fetchCompletionStats(Number(id), "day"),
          fetchAnswerStats(Number(id)),
          fetchAverageTime(Number(id)),
        ]);
        setCompletions(completionRes);
        setAnswers(answerRes);
        setAvgTime(avgTimeRes.averageDuration);
      } catch (error) {
        console.error("Error loading statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <p className="text-xl text-gray-400">📊 Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 py-10 px-4">
      <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => (window.location.href = "/")}
          className="mb-8 flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition hover:bg-blue-700"
        >
          <span>🔙</span>
          <span>Back to Questionnaire List</span>
        </button>

        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          📈 Questionnaire Statistics
        </h1>

        <div className="mx-auto mb-10 max-w-4xl rounded-xl bg-gray-800 p-6 shadow-lg">
          <div className="text-center text-xl text-white">
            ⏱ Average Completion Time:{" "}
            <span className="font-bold text-blue-400">
              {avgTime ? `${Math.round(Number(avgTime))} seconds` : "No data yet"}
            </span>
          </div>
        </div>

        <div className="mb-10 w-full overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg">
          <h2 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-semibold text-white">
            📆 <span>Completions Per Day</span>
          </h2>

          <div className="h-[400px] w-full pl-4 pr-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={completions}
                margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
              >
                <XAxis
                  dataKey="date"
                  stroke="#e5e7eb"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                  interval="preserveStartEnd"
                  height={50}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -20,
                    fill: "#d1d5db",
                    fontSize: 14,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#e5e7eb"
                  tick={{ fill: "#9ca3af" }}
                  label={{
                    value: "Completions",
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                    fill: "#d1d5db",
                    fontSize: 14,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                    color: "#f3f4f6",
                  }}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full">
          <h2 className="mb-8 text-center text-2xl font-semibold text-white">
            📊 Questions Breakdown
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {answers.map((question, qIdx) => (
              <div
                key={qIdx}
                className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-colors hover:border-blue-500"
              >
                <h3 className="mb-4 text-center text-lg font-medium text-white">
                  {question.questionText}
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={question.options}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        label={({ percent }) =>
                          typeof percent === "number"
                            ? `${(percent * 100).toFixed(0)}%`
                            : ""
                        }
                        labelLine={false}
                      >
                        {question.options.map((_entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#1f2937",
                          borderColor: "#374151",
                          borderRadius: "0.5rem",
                          color: "#f3f4f6",
                        }}
                        formatter={(value: number, name: string, props) => {
                          const percent = props?.payload?.percent;
                          const percentStr =
                            typeof percent === "number"
                              ? ` (${(percent * 100).toFixed(1)}%)`
                              : "";
                          return [`${value}`, `${name}${percentStr}`];
                        }}
                      />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
