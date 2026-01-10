import { useNavigate } from "react-router-dom";
import "../App.css";

function Culture() {
  const navigate = useNavigate();

  const team = [
    
    { name: "Yash Cultural Secretary” (diploma)", number: "93264 32115", isAdmin: false },
    { name: "Vrinda President (degree)", number: "93216 67211", isAdmin: false },
    { name: "Sarthak General Secretary (diploma)", number: "93215 71170", isAdmin: false },
    { name: "Famy Member (degree)", number: "93219 44581", isAdmin: false },
    { name: "Param Mentor (diploma)", number: "9869383630", isAdmin: true },
  ];

  return (
    <div className="App">
      <h1>🎭 Cultural Team</h1>

      <div className="form-card">
        {team.map((member, index) => (
          <div
            key={index}
            className={`team-card ${member.isAdmin ? "admin" : ""}`}
            onClick={() => member.isAdmin && navigate("/login")}
          >
            <div className="team-name">
              {index + 1}. {member.name}
              {member.isAdmin && " "}
            </div>

            <div className="team-phone">
              📞 {member.number}
            </div>
          </div>
        ))}

        <br />

        <button className="btn-secondary" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}

export default Culture;
