import { useForm, SubmitHandler } from "react-hook-form";

interface ChapterFormProps {
  onSubmit: (data: FormData) => void; // Accepts FormData to handle file uploads
}

const ChapterForm = ({ onSubmit }: ChapterFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ pdfFile: FileList }>();

  const onSubmitHandler: SubmitHandler<{ pdfFile: FileList }> = (data) => {
    const formData = new FormData();
    formData.append("pdfFile", data.pdfFile[0]); // Handle file upload
    onSubmit(formData); // Submit formData
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4" encType="multipart/form-data">
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          {...register("pdfFile", { required: "PDF file is required" })}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.pdfFile && <p className="text-red-500 text-sm">{errors.pdfFile.message}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        Add Chapter
      </button>
    </form>
  );
};

export default ChapterForm;
