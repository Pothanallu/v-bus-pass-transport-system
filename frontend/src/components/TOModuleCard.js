import { useNavigate } from "react-router-dom";
import "../styles/TOModuleCard.css";

function ModuleCard({ title, description, path, icon }) {
  const navigate = useNavigate();

  return (
    <div className="module-card">
      <div className="module-icon">{icon}</div>

      <h3>{title}</h3>
      <p>{description}</p>

      <button onClick={() => navigate(path)}>Open Module</button>
    </div>
  );
}

export default ModuleCard;
