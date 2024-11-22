import React from "react";

// Componente para exibir a pergunta
const PollQuestion = ({ question }) => {
  return <h2 className="text-white text-xl font-bold mb-4">{question}</h2>;
};

// Componente para exibir cada opção
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

// Componente para renderizar a lista de opções
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

// Componente para exibir o total de votos
const PollSummary = ({ totalVotes }) => {
  return (
    <p className="text-gray-400 text-sm mt-4">{totalVotes} votes</p>
  );
};

// Componente para o botão de votar
const PollVoteButton = () => {
  return (
    <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg">
      Vote
    </button>
  );
};

// Contêiner principal que engloba tudo
const PollContainer = () => {
  const question = "Which is the best?";
  const options = [
    { label: "Option #1", votes: 4324, percentage: 97, isSelected: true },
    { label: "Option #2", votes: 32, percentage: 1, isSelected: false },
    { label: "Option #3", votes: 43, percentage: 1, isSelected: false },
    { label: "Option #4", votes: 47, percentage: 14, isSelected: false },
  ];
  const totalVotes = 3042;

  return (
    <div className="bg-black p-6 rounded-lg max-w-md mx-auto">
      <PollQuestion question={question} />
      <PollOptionsList options={options} />
      <PollSummary totalVotes={totalVotes} />
      <PollVoteButton />
    </div>
  );
};

export default PollContainer;
