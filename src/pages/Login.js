import { useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!password) {
      alert("Please enter password");
      return;
    }

    try {
      setLoading(true);
      const ref = doc(db, "admin", "config");
      const snap = await getDoc(ref);

      if (snap.exists() && password === snap.data().password) {
        sessionStorage.setItem("admin", "true");
        navigate("/students");
      } else {
        alert("Wrong password ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
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
          disabled={loading}
        />

        <div className="action-row">
          <button
            className="btn-primary"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/culture")}
            disabled={loading}
          >
            ⬅ Back to Culture
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
