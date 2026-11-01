import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(-1)} className="back-button">
      <FontAwesomeIcon icon={faArrowLeft} /> Voltar
    </div>
  );
}

export default BackButton;
