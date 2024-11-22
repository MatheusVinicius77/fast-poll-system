import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PollDetailsModal = ({ poll, onClose, updatePoll }) => {
  const [votes, setVotes] = useState(poll?.Options || []);

  const handleVote = async (optionId) => {
    try {
      const response = await fetch("http://localhost:8040/vote/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poll_id: poll.PollID, option_id: optionId }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao registrar o voto: ${response.statusText}`);
      }

      const updatedVotes = await response.json();

      // Atualiza o estado local com os novos votos
      const updatedOptions = votes.map((option) =>
        option.OptionID === optionId
          ? { ...option, Votes: updatedVotes.Attributes.Votes }
          : option
      );
      setVotes(updatedOptions);
      updatePoll({
        ...poll,
        Options: updatedOptions,
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar o voto. Tente novamente.");
    }
  };


  const calculatePercentages = () => {
    if (!Array.isArray(votes) || votes.length === 0) {
      return []; // Retorna um array vazio se votes estiver vazio ou inválido
    }
  
    const totalVotes = votes.reduce((acc, option) => acc + (option.Votes || 0), 0);
    return votes.map((option) => ({
      ...option,
      percentage: totalVotes > 0 ? ((option.Votes || 0) / totalVotes) * 100 : 0,
    }));
  };

  const optionsWithPercentages = calculatePercentages();

  if (!poll) return null;


  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalhes da Enquete</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <h3>{poll.Title}</h3>
            <ul className="list-group mt-3">
              {optionsWithPercentages.map((option) => (
                <li key={option.OptionID} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{option.OptionText}</span>
                  <span>{option.percentage.toFixed(2)}%</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleVote(option.OptionID)}
                  >
                    Votar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetailsModal;
