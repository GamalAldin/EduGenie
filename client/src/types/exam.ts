// Define the structure for each question
export interface Question {
    question_number: number;
    question: string;
    model_answer: string;
    grading_criteria: string[];  // Directly use a string array
    choices?: string[] | null; // Optional: can be null or an array of strings
    correct_answer?: string | boolean | null; // Optional: can be a string, boolean, or null
    _id: string;
  }
  
  // Define the structure for each section
  export interface Section {
    section_number: number;
    section_title: string;
    questions: Question[];
    _id: string;
  }
  
  // Define the structure for the entire exam
  export interface Exam {
    _id: string;
    exam_topic: string;
    sections: Section[];
    course: string;
    __v: number; // For the versioning field
  }
  