import { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Thanks";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    sapId: "",
    semester: "",
    rollNo: "",
    course: "",
    branch: "",
    studentCount: "",
    stallType: "",
    extraTables: 0,
    electricBoards: 0,
    terms: false,
  });

  // 🔁 Handle input (checkbox & number safe)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  /* ================= PRICE LOGIC (PROPER & LOCKED) ================= */

  // 💰 Stall base prices
  const stallPrices = {
    Food: 300,
    Game: 600,
    Both: 900,
    other: 300,
  };

  const getBasePrice = () => stallPrices[form.stallType] || 0;

  // ➕ Extra charges (₹150 each)
  const extraCharges =
    Number(form.extraTables) * 150 +
    Number(form.electricBoards) * 150;

  // 🪙 Total amount
  const totalAmount = getBasePrice() + extraCharges;

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (loading) return;

    if (
      !form.name ||
      !form.phone ||
      !form.sapId ||
      !form.semester ||
      !form.rollNo ||
      !form.course ||
      !form.branch ||
      !form.studentCount ||
      !form.stallType
    ) {
      alert("All fields are required ❌");
      return;
    }

    if (form.phone.length !== 10) {
      alert("Phone must be 10 digits ❌");
      return;
    }

    if (form.sapId.length !== 11) {
      alert("SAP ID must be 11 digits ❌");
      return;
    }

    if (!form.terms) {
      alert("Please accept terms & conditions ❌");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "registrations"), {
        ...form,
        basePrice: getBasePrice(),
        extraCharges,
        totalAmount,
        paid: false,
        createdAt: serverTimestamp(),
      });

      alert("Registration successful ✅");
      navigate("/thanks");
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="App">
      <h1>Student Registration</h1>

      <div className="form-card">
        <div className="form-grid">
          <input name="name" placeholder="Name" onChange={handleChange} />

          <input
            name="phone"
            placeholder="Phone (10 digits)"
            maxLength={10}
            onChange={handleChange}
          />

          <input
            name="sapId"
            placeholder="SAP ID (11 digits)"
            maxLength={11}
            onChange={handleChange}
          />

          <input name="semester" placeholder="Semester" onChange={handleChange} />
          <input name="rollNo" placeholder="Roll No" onChange={handleChange} />

          <select name="course" onChange={handleChange}>
            <option value="">Course</option>
            <option value="Diploma">Diploma</option>
            <option value="Degree">Degree</option>
          </select>

          <select name="branch" onChange={handleChange}>
            <option value="">Branch</option>
            <option value="Computer">Computer</option>
            <option value="IT">IT</option>
            <option value="Civil">Civil</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
            <option value="Plastic">Plastic</option>
            <option value="AIML">AIML</option>
            <option value="Computer Science">Computer Science</option>
            <option value="EXTC">EXTC</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select name="studentCount" onChange={handleChange}>
            <option value="">No. of Students</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <select name="stallType" onChange={handleChange}>
            <option value="">Stall Type</option>
            <option value="Food">Food (₹300)</option>
            <option value="Game">Game (₹600)</option>
            <option value="Both">Game + Food (₹900)</option>
            <option value="other">Other (₹300)</option>
          </select>

          <input
            type="number"
            name="extraTables"
            placeholder="Extra Tables"
            min="0"
            onChange={handleChange}
          />

          <input
            type="number"
            name="electricBoards"
            placeholder="Electric Boards"
            min="0"
            onChange={handleChange}
          />
        </div>

        {/* ✅ Checkbox */}
        <div className="terms-row">
          <label className="terms-container">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <span className="terms-text">
              I accept all <b>terms & conditions</b>
            </span>
          </label>
        </div>

        {/* ✅ Price Summary */}
        <div className="summary">
          💰 Base Price: ₹{getBasePrice()} <br />
          ➕ Extra Charges: ₹{extraCharges} <br />
          🪙 <b>Total Amount: ₹{totalAmount}</b>
        </div>

        <div className="action-row">
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            ⬅ Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
