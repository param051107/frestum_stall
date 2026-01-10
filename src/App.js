import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Thanks from "./pages/Thanks";
import Login from "./pages/Login";
import Students from "./pages/Students";
import Culture from "./pages/Culture";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/students" element={<Students />} />
        <Route path="/culture" element={<Culture />} />
      </Routes>
    </Router>
  );
}

export default App;
