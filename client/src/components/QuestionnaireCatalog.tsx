import { useEffect, useState } from "react";
import {
  getQuestionnaires,
  deleteQuestionnaire,
} from "../api/questionnaireApi";
import { Link } from "react-router-dom";
import { Questionnaire } from "../interfaces";

const QuestionnaireCatalog = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const LIMIT = 6;

  const fetchData = async (pageNumber = 1, sort = sortBy) => {
    try {
      setLoading(true);
      const { data, totalPages } = await getQuestionnaires(
        pageNumber,
        LIMIT,
        sort
      );
      setQuestionnaires(data);
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, sortBy);
  }, [sortBy]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      setLoadingId(id);
      await deleteQuestionnaire(id);
      setLoadingId(null);
      fetchData(page);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-6xl">
        {/* Header & Sorting */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">Quiz List</h1>
          <div className="flex items-center gap-4">
            <select
              className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name ↑</option>
              <option value="name_desc">Sort by Name ↓</option>
              <option value="questions">Sort by Questions ↑</option>
              <option value="questions_desc">Sort by Questions ↓</option>
              <option value="completions">Sort by Completions ↑</option>
              <option value="completions_desc">Sort by Completions ↓</option>
            </select>
            <Link to="/builder">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition">
                ➕ Create Quiz
              </button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-400">Loading quizzes...</p>
        ) : questionnaires.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No quizzes found.</p>
        ) : (
          <>
            {/* Quiz Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {questionnaires.map((q) => (
                <div
                  key={q.id}
                  className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-bold text-white">{q.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{q.description}</p>
                  <p className="text-gray-400 text-sm mb-4">
                    📌 {q.questions?.length ?? 0} questions · ✅{" "}
                    {q.completionsCount ?? 0} completions
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/survey/${q.id}`}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                    >
                      Run
                    </Link>
                    <Link
                      to={`/builder/${q.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={loadingId === q.id}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {loadingId === q.id ? "Deleting…" : "Delete"}
                    </button>
                    <Link
                      to={`/statistics/${q.id}`}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      📊 View Stats
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button
                onClick={() => fetchData(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50"
              >
                ◀ Previous
              </button>
              <span className="text-white text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchData(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireCatalog;
