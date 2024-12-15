import { useForm, SubmitHandler } from "react-hook-form";
import { Course } from "@/types/course";
import InputField from "@/components/InputField";

const CourseForm = ({ type, data, onSubmit }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Course>({
    defaultValues: data || { name: "", courseCode: "" }, // Ensure default values are set
  });

  const onSubmitHandler: SubmitHandler<Course> = (data) => {
    onSubmit(data); // Submit form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <InputField
        label="Course Name"
        name="name"
        register={register}
        error={errors.name?.message} // Handle validation error
      />
      <InputField
        label="Course Code"
        name="courseCode"
        register={register}
        error={errors.courseCode?.message} // Handle validation error
      />
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default CourseForm;
