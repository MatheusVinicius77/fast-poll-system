import React from "react";


const PollOptionsList = ({ options }) => {
    return (
      <div className="space-y-2">
        {options.map((option, index) => (
          <PollOption
            key={index}
            option={option.label}
            votes={option.votes}
            percentage={option.percentage}
            isSelected={option.isSelected}
          />
        ))}
      </div>
    );
  };
  
export default PollOptionsList;