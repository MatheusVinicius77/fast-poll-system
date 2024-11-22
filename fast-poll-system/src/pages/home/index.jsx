import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CreatePollModal from "../../components/CreatePollModal/CreatePollModal";
import PollDetailsModal from "../../components/PollDetailsModal/PollDetailsModal";

import {getAllItems} from "../../services/dynamo_db"
const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null); // Enquete selecionada
  const [polls, setPolls] = useState([]); // Estado para armazenar as enquetes
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função para abrir o modal de detalhes de uma enquete
  const handleOpenDetailsModal = (poll) => setSelectedPoll(poll);
  // Fecha o modal de detalhes
  const handleCloseDetailsModal = () => setSelectedPoll(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Atualiza a enquete no estado polls
  const updatePoll = (updatedPoll) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.PollID === updatedPoll.PollID ? updatedPoll : poll
      )
    );
  };

  // Função para buscar todas as enquetes
  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await getAllItems(); // Chama o serviço de busca
      setPolls(data || []); // Garante que polls será um array, mesmo se data for undefined ou null
    } catch (error) {
      console.error("Erro ao buscar enquetes:", error);
      setPolls([]); // Define um array vazio em caso de erro
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);
  

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 className="text-success">Fast Poll System</h1>
      </div>

      <div className="row ">
        <div className="col-md-6 m-auto w-100 text-center">
          <div
            className="border border-danger text-center rounded p-4"
            style={{ cursor: "pointer" }}
            onClick={handleOpenModal}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                position: "relative",
                margin: "auto"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  background: "red",
                  width: "8px",
                  height: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  background: "red",
                  width: "100%",
                  height: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              ></div>
            </div>
            <h4 className="mt-3">Criar enquete</h4>
          </div>
        </div>
      </div>
        {/* Lista de enquetes */}
      <div className="mt-4">
        <h2 className="text-center mb-3">Enquetes Disponíveis</h2>
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : polls.length > 0 ? (
          <div className="list-group">
            {polls.map((poll) => {
              // Calcula o total de votos para a enquete
              const totalVotes = poll.Options.reduce(
                (acc, option) => acc + (option.Votes || 0),
                0
              );

              return (
                <button
                  key={poll.PollID}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => handleOpenDetailsModal(poll)}
                >
                  <span>{poll.Title}</span>
                  <span className="badge bg-primary">{totalVotes} votos</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center">Nenhuma enquete disponível</p>
        )}
      </div>
      {/* Modal Component */}
      {showModal && <CreatePollModal onClose={handleCloseModal} fetchPolls={fetchPolls} />}

        {/* Modal de detalhes da enquete */}
        {selectedPoll && (
        <PollDetailsModal
          poll={selectedPoll}
          onClose={handleCloseDetailsModal}
          updatePoll={updatePoll}
        />
      )}
      
    </div>
  );
};

export default Home;
