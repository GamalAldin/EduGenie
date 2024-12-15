import { UseFormRegister } from "react-hook-form";
import { Course } from "@/types/course"; // Ensure you have the correct path to your Course type

type InputFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegister<Course>; // Use the Course type here
  name: keyof Course; // Restrict name to the keys of the Course type
  defaultValue?: string;
  error?: string; // Error as string or undefined
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label htmlFor={name as string} className="text-xs text-gray-500">
        {label}
      </label>
      <input
        id={name as string}
        type={type}
        {...register(name)} // Name now matches keyof Course
        className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full ${
          error ? "ring-red-400" : ""
        }`}
        defaultValue={defaultValue}
        {...inputProps}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p> // Display error if exists
      )}
    </div>
  );
};

export default InputField;
