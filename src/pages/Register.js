import { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";

/* ================= PRICES ================= */
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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    sapId: "",
    semester: "",
    rollNo: "",
    course: "",
    branch: "",
    stallType: "",
    location: "",
    stallName: "",
    electric: false,
    terms: false,
  });

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= STALL NAME LABEL ================= */
  const getStallNameLabel = () => {
    if (form.stallType === "GAME") return "Game Name";
    if (form.stallType === "FOOD_1" || form.stallType === "FOOD_2")
      return "Food Item Name";
    if (form.stallType === "OTHER") return "Stall Description";
    return "";
  };

  /* ================= PRICE CALC ================= */
  const calculatePrices = () => {
    let basePrice = 0;

    if (form.stallType === "TREASURE") {
      basePrice = PRICES.TREASURE;
    } else if (form.location) {
      basePrice = PRICES[form.location]?.[form.stallType] || 0;
    }

    const electricCharge = form.electric ? PRICES.ELECTRIC : 0;

    return {
      basePrice,
      electricCharge,
      totalAmount: basePrice + electricCharge,
    };
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (loading) return;

    const required = [
      "name",
      "phone",
      "sapId",
      "semester",
      "rollNo",
      "course",
      "branch",
      "stallType",
    ];

    for (let field of required) {
      if (!form[field]) {
        alert(`Please fill ${field}`);
        return;
      }
    }

    if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return;
    }

    if (form.sapId.length !== 11 || !/^\d+$/.test(form.sapId)) {
      alert("SAP ID must be 11 digits");
      return;
    }

    if (form.stallType !== "TREASURE" && !form.location) {
      alert("Please select location");
      return;
    }

    if (form.stallType !== "TREASURE" && !form.stallName.trim()) {
      alert("Please enter stall details");
      return;
    }

    if (!form.terms) {
      alert("Accept Festum rules");
      return;
    }

    const prices = calculatePrices();

    const data = {
      name: form.name.trim(),
      phone: form.phone,
      sapId: form.sapId,
      semester: form.semester,
      rollNo: form.rollNo,
      course: form.course,
      branch: form.branch,
      stallType: form.stallType,
      stallName: form.stallName || "N/A",
      location: form.location || "N/A",
      electric: form.electric,
      totalAmount: prices.totalAmount,
      paid: false,
      createdAt: serverTimestamp(),
    };

    try {
      setLoading(true);
      await addDoc(collection(db, "registrations"), data);
      alert("Registration Successful");
      navigate("/thanks");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const prices = calculatePrices();

  /* ================= UI ================= */
  return (
    <div className="App">
      <h1>Festum Registration</h1>

      <div className="form-card">
        {/* STUDENT DETAILS */}
        <div className="section">
          <div className="section-title">Student Details</div>
          <div className="form-grid">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="phone" placeholder="Phone (10 digits)" maxLength={10} value={form.phone} onChange={handleChange} />
            <input name="sapId" placeholder="SAP ID (11 digits)" maxLength={11} value={form.sapId} onChange={handleChange} />
            <input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} />
            <input name="rollNo" placeholder="Roll No" value={form.rollNo} onChange={handleChange} />

            <select name="course" value={form.course} onChange={handleChange}>
              <option value="">Course</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
            </select>

            <select name="branch" value={form.branch} onChange={handleChange}>
              <option value="">Branch</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Chemical">Chemical</option>
              <option value="Plastic">Plastic</option>
              <option value="AIML">AI & ML</option>
              <option value=">Computer science">Computer science</option>
              <option value="EXTC">EXTC</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>
        </div>

        {/* STALL DETAILS */}
        <div className="section">
          <div className="section-title">Stall Details</div>
          <div className="form-grid">
            <select name="stallType" value={form.stallType} onChange={handleChange}>
              <option value="">Stall Type</option>
              <option value="FOOD_1(3)">1 Food Stall (3 members)</option>
              <option value="FOOD_2(3+1)">2 Food Stalls (3+1)</option>
              <option value="GAME(2)">Game Stall (2 members)</option>
              <option value="OTHER">Other Stall</option>
              <option value="TREASURE">Treasure Hunt (5 members)</option>
            </select>

            {form.stallType !== "TREASURE" && (
              <select name="location" value={form.location} onChange={handleChange}>
                <option value="">Location</option>
                <option value="Ground">Ground</option>
                <option value="Basement">Upper Basement</option>
              </select>
            )}
          </div>

          {form.stallType && form.stallType !== "TREASURE" && (
            <div className="form-group full-width">
              <label>{getStallNameLabel()}</label>
              <input
                name="stallName"
                placeholder={`Enter ${getStallNameLabel()}`}
                value={form.stallName}
                onChange={handleChange}
              />
            </div>
          )}

          {form.stallType !== "TREASURE" && (
          <label className="checkbox-row">
  <input
    type="checkbox"
    name="electric"
    checked={form.electric}
    onChange={handleChange}
  />
  <span>Electric Plug Point Required (₹350)</span>
</label>

          )}
        </div>

        {/* AMOUNT SUMMARY */}
        <div className="summary">
          <h3>Amount Summary</h3>
          <p>Base Price: ₹{prices.basePrice}</p>
          {form.electric && <p>Electric Charge: ₹{prices.electricCharge}</p>}
          <h2>Total: ₹{prices.totalAmount}</h2>
        </div>

        {/* TERMS */}
       <label className="checkbox-row">
  <input
    type="checkbox"
    name="terms"
    checked={form.terms}
    onChange={handleChange}
  />
  <span>I accept all Festum rules & conditions</span>
</label>

        <button className="submit-btn" onClick={submit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </div>
    </div>
  );
}

export default Register;
