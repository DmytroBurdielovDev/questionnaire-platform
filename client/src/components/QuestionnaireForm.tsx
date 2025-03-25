import { QuestionnaireFormProps } from '../interfaces';

const QuestionnaireForm = ({ name, description, setName, setDescription, nameError }: QuestionnaireFormProps) => (
  <>
    <div className="mb-4">
      <label className="text-gray-300 text-sm block mb-1">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`w-full p-3 bg-gray-800 text-white rounded border ${nameError ? "border-red-500" : "border-gray-600"
          }`}
      />
      {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
    </div>

    <div className="mb-6">
      <label className="text-gray-300 text-sm block mb-1">Description</label>
      <textarea
        placeholder="Enter questionnaire description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition"
      />
    </div>
  </>
);

export default QuestionnaireForm;
