import { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";

const PRICES = {
  Ground: {
    FOOD_1: 600,
    FOOD_2: 1100,
    GAME: 1000,
    OTHER: 1000,
  },
  Basement: {
    FOOD_1: 500,
    FOOD_2: 900,
    GAME: 700,
    OTHER: 700,
  },
  ELECTRIC: 350,
  TREASURE: 500,
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    sapId: "",
    semester: "",
    rollNo: "",
    course: "",
    branch: "",
    stallType: "",
    stallName: "",
    location: "",
    electric: false,
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const getStallLabel = () => {
    if (form.stallType === "GAME") return "Game Name";
    if (form.stallType === "FOOD_1" || form.stallType === "FOOD_2")
      return "Food Item Name";
    if (form.stallType === "OTHER") return "Stall Description";
    return "";
  };

  const calculateTotal = () => {
    let base = 0;
    if (form.stallType === "TREASURE") {
      base = PRICES.TREASURE;
    } else if (form.location) {
      base = PRICES[form.location]?.[form.stallType] || 0;
    }
    return base + (form.electric ? PRICES.ELECTRIC : 0);
  };

  const submit = async () => {
    if (!form.terms) {
      alert("Accept terms & conditions");
      return;
    }

    await addDoc(collection(db, "registrations"), {
      ...form,
      totalAmount: calculateTotal(),
      paid: false,
      createdAt: serverTimestamp(),
    });

    navigate("/thanks");
  };

  return (
    <div className="App">
      <h1>Festum Registration</h1>

      <div className="form-card">
        {/* STUDENT DETAILS */}
        <div className="section">
          <div className="section-title">Student Details</div>
          <div className="form-grid">
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="phone" placeholder="Phone (10 digits)" onChange={handleChange} />
            <input name="sapId" placeholder="SAP ID (11 digits)" onChange={handleChange} />
            <input name="semester" placeholder="Semester" onChange={handleChange} />
            <input name="rollNo" placeholder="Roll No" onChange={handleChange} />

            <select name="course" onChange={handleChange}>
              <option value="">Course</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
            </select>

            <select name="branch" onChange={handleChange}>
              <option value="">Branch</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="IT">IT</option>
              <option value="Computer science">Computer science Engineering</option>
              <option value="EXTC">EXTC</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Chemical">Chemical</option>
              <option value="plastic">Plastic</option>
              <option value="AIML">AIML</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>
        </div>

        {/* STALL DETAILS */}
        <div className="section">
          <div className="section-title">Stall Details</div>

          <div className="form-grid">
            <select name="stallType" onChange={handleChange}>
              <option value="">Stall Type</option>
              <option value="FOOD_1(3)">1 Food Stall(3 member)</option>
              <option value="FOOD_2(3+1)">2 Food Stalls(3+1)</option>
              <option value="GAME(2)">Game Stall(2 member)</option>
              <option value="OTHER">Other Stall</option>
              <option value="TREASURE">Treasure Hunt(5 member)</option>
            </select>

            {form.stallType !== "TREASURE" && (
              <select name="location" onChange={handleChange}>
                <option value="">Location</option>
                <option value="Ground">Ground</option>
                <option value="Basement">Upper Basement</option>
              </select>
            )}
          </div>

          {form.stallType && form.stallType !== "TREASURE" && (
            <input
              className="full-width"
              name="stallName"
              placeholder={getStallLabel()}
              onChange={handleChange}
            />
          )}

          {form.stallType !== "TREASURE" && (
            <label className="checkbox-row">
              <input type="checkbox" name="electric" onChange={handleChange} />
              <span>Electric Plug Point Required (₹350)</span>
            </label>
          )}
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <h3>Amount Summary</h3>
          <h2>Total: ₹{calculateTotal()}</h2>
        </div>

        <label className="checkbox-row">
          <input type="checkbox" name="terms" onChange={handleChange} />
          <span>I accept all Festum rules & conditions</span>
        </label>

        <button className="submit-btn" onClick={submit}>
          Submit Registration
        </button>
      </div>
    </div>
  );
}

export default Register;
