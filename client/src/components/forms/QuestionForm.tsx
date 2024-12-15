import { useForm, SubmitHandler } from "react-hook-form";
import { Question } from "@/types/exam";

interface QuestionFormProps {
  question?: Question | null; // Allow null or undefined
  onSubmit: (data: Question) => void; // Expect a full `Question` type
}

interface QuestionFormInputs {
  _id?: string; // Optional, for existing questions
  question_number?: number; // Optional, for existing questions
  question: string;
  choices?: string[];
  correct_answer?: string;
  model_answer: string;
  grading_criteria: string[];
}

const QuestionForm = ({ question, onSubmit }: QuestionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormInputs>({
    defaultValues: {
      _id: question?._id || undefined,
      question_number: question?.question_number || undefined,
      question: question?.question || "",
      choices: question?.choices || ["", "", "", ""],
      correct_answer:
        typeof question?.correct_answer === "string"
          ? question.correct_answer
          : "",
      model_answer: question?.model_answer || "",
      grading_criteria: question?.grading_criteria || [],
    },
  });

  const onSubmitHandler: SubmitHandler<QuestionFormInputs> = (data) => {
    if (!data._id) {
      throw new Error("Missing `_id` for Question"); // Ensure `_id` is handled properly
    }

    const normalizedData: Question = {
      question_number: data.question_number ?? 0,
      question: data.question,
      choices: data.choices,
      correct_answer: data.correct_answer,
      model_answer: data.model_answer,
      grading_criteria: data.grading_criteria,
      _id: data._id, // Guaranteed to exist
    };

    onSubmit(normalizedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      {/* Question Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <textarea
          {...register("question", { required: "Question text is required" })}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        {errors.question && (
          <p className="text-red-500 text-sm">{errors.question.message}</p>
        )}
      </div>

      {/* Choices Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Choices
        </label>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              {...register(`choices.${index}` as const)} // Explicitly specify `string` type for choices
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Choice ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Correct Answer Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correct Answer
        </label>
        <input
          type="text"
          {...register("correct_answer")}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Correct answer (optional)"
        />
      </div>

      {/* Model Answer Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Model Answer
        </label>
        <textarea
          {...register("model_answer", {
            required: "Model answer is required",
          })}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        {errors.model_answer && (
          <p className="text-red-500 text-sm">{errors.model_answer.message}</p>
        )}
      </div>

      {/* Grading Criteria Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Grading Criteria
        </label>
        <textarea
          {...register("grading_criteria" as any, {
            required: "Grading criteria is required",
          })}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Enter grading criteria, one per line"
          defaultValue={question?.grading_criteria?.join("\n") || ""} // Show criteria as multiline text
        />
        {errors.grading_criteria && (
          <p className="text-red-500 text-sm">
            {errors.grading_criteria.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        {question ? "Update Question" : "Add Question"}
      </button>
    </form>
  );
};

export default QuestionForm;
