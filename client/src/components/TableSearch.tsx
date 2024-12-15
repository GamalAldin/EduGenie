import React from "react";
import Image from "next/image";

interface TableSearchProps {
  value: string; // Search query value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
}

const TableSearch = ({ value, onChange }: TableSearchProps) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="Search Icon" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        value={value} // Controlled input
        onChange={onChange} // Calls the handler when input changes
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
