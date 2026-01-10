import { useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const ref = doc(db, "admin", "config");
    const snap = await getDoc(ref);

    if (snap.exists() && password === snap.data().password) {
      sessionStorage.setItem("admin", "true");
      navigate("/students");
    } else {
      alert("Wrong password ❌");
    }
  };

  return (
    <div className="App">
      <h1>🔐 Admin Login</h1>

      <div className="form-card" style={{ maxWidth: 400 }}>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="action-row">
          <button className="btn-primary" onClick={login}>
            Login
          </button>

          {/* 👈 BACK TO CULTURE PAGE */}
          <button
            className="btn-secondary"
            onClick={() => navigate("/culture")}
          >
            ⬅ Back to Culture
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
