import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {putItem} from "../../services/dynamo_db";

const CreatePollModal = ({ onClose, fetchPolls }) => {
  const [title, setTitle] = useState(""); // Estado para o título
  const [options, setOptions] = useState(["", ""]); // Inicialmente com duas opções

  // Adiciona uma nova opção
  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  // Remove uma opção específica
  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    } else {
      alert("A enquete precisa ter pelo menos 2 opções.");
    }
  };

  // Atualiza o texto de uma opção específica
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Finaliza a criação da enquete
  const handleCreatePoll = async () => {
    if (!title.trim()) {
      alert("O título da enquete não pode estar vazio.");
      return;
    }
    if (options.length < 2) {
      alert("A enquete precisa ter pelo menos 2 opções.");
      return;
    }
    if (options.some((option) => !option.trim())) {
      alert("Todas as opções devem ser preenchidas.");
      return;
    }
    const item = {
      PollID: Date.now(), // Gera um ID único usando o timestamp atual
      Options: options.map((option, index) => ({
        OptionID: index + 1,
        OptionText: option,
      })),
      Title: title,
    };
  
    console.log("Enquete criada:", item);
    try {
      const response = await putItem(item);
      
      if (response) {
        alert("Enquete criada com sucesso!");
        fetchPolls();
        onClose(); // Fecha o modal após o sucesso
      } else {
        alert("Erro ao criar a enquete. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao criar a enquete. Por favor, tente novamente.");
    }

  };


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
            <h5 className="modal-title">Criar Enquete</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Campo de título da enquete */}
            <div className="mb-3">
              <label className="form-label">{ title || "Título da Enquete"}</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // Permite editar o título
                placeholder="Digite o título da enquete"
              />
            </div>

            {/* Lista de opções */}
            <div>
              {options.map((option, index) => (
                <div
                  className="d-flex align-items-center mb-2"
                  key={index}
                >
                  <input
                    type="text"
                    className="form-control me-2"
                    value={option}
                    placeholder={`Opção ${index + 1}`}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value)
                    } // Permite editar a opção
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveOption(index)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* Botão para adicionar mais opções */}
            <div className="text-end mt-3">
              <button
                className="btn btn-primary"
                onClick={handleAddOption}
              >
                Adicionar Opção
              </button>
            </div>
          </div>

          {/* Rodapé do modal */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={handleCreatePoll} // Valida e cria a enquete
            >
              Criar Enquete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;
