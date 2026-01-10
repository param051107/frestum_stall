import { useNavigate } from "react-router-dom";
import "../App.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="App "
      
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* MAIN CARD */}
      <div
        className="form-card"
        style={{
          textAlign: "center",
          maxWidth: 460,
          width: "100%",
          marginBottom: 20
        }}
      >
        <h1 style={{ marginBottom: 5 }}>WELCOME TO</h1>

        <h2
          style={{
            marginTop: 0,
            marginBottom: 20,
            color: "#2563eb",
            fontWeight: 600
          }}
        >
          Festum 2026
        </h2>

        {/* 🔥 MOTIVATION LINES */}
        <div className="welcome-lines">
          <p>“Don’t just attend the fest — run a business!”</p>
          <p>“Turn your ideas into income.”</p>
          <p>“Learn, lead, and earn at Festum 2026.”</p>
          <p>“From classroom to cash counter.”</p>
        </div>

        <div className="action-row" style={{ justifyContent: "center" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            📝 Register
          </button>
        </div>
      </div>

      {/* OUTSIDE CARD LINK */}
      <p className="help-text">
        If you have any problem,{" "}
        <span
          className="culture-link"
          onClick={() => navigate("/culture")}
        >
          contact Cultural Team
        </span>
      </p>
    </div>
  );
}

export default Welcome;
