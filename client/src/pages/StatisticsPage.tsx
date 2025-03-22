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
    return <p className="text-center text-gray-400 mt-10">📊 Loading statistics...</p>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 py-10 px-4">
      <div className="w-full space-y-10 px-4 md:px-10">
      <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            🔙 Back to Questionnaire List
          </button>
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          📈 Questionnaire Statistics
        </h1>

        {/* Average Completion Time */}
        <div className="text-center text-white text-lg mb-8">
          ⏱ Average Completion Time:{" "}
          <span className="font-bold">
            {avgTime ? `${Math.round(Number(avgTime))} seconds` : "No data yet"}
          </span>
        </div>

        {/* Completions Over Time */}
        <div className="bg-gray-800 p-4 rounded shadow border border-gray-700 mb-10 mx-auto max-w-7xl">
          <h2 className="text-white text-xl mb-4 text-center">📆 Completions Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completions}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts Per Question */}
        <div className="grid gap-8 px-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {answers.map((question, qIdx) => (
            <div
              key={qIdx}
              className="bg-gray-800 p-4 rounded shadow border border-gray-700"
            >
              <h3 className="text-white text-lg mb-4 text-center">
                🧠 {question.questionText}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={question.options}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {question.options.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default StatisticsPage;
