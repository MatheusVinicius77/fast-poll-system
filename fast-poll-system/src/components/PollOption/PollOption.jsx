import React from "react";

const PollOption = ({ option, votes, percentage, isSelected }) => {
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-lg mb-2 ${
          isSelected ? "bg-purple-700" : "bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-4">
          <span
            className={`text-lg font-bold ${
              isSelected ? "text-white" : "text-gray-400"
            }`}
          >
            {option}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm ${
              isSelected ? "text-white" : "text-gray-400"
            }`}
          >
            {votes} votes
          </span>
          <span
            className={`text-sm ${
              isSelected ? "text-white" : "text-gray-400"
            }`}
          >
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

export default PollOption;