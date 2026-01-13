import { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Reset location & electric for Treasure Hunt
    if (name === "stallType" && value === "TREASURE") {
      setForm({
        ...form,
        stallType: value,
        location: "",
        electric: false,
        stallName: "",
      });
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= STALL LABEL ================= */
  const getStallLabel = () => {
    if (form.stallType === "GAME") return "Game Name";
    if (form.stallType === "FOOD_1" || form.stallType === "FOOD_2")
      return "Food Item Name";
    if (form.stallType === "OTHER") return "Stall Description";
    return "";
  };

  /* ================= PRICE LOGIC ================= */
  const getStallPrice = () => {
    if (!form.stallType) return 0;

    if (form.stallType === "TREASURE") {
      return PRICES.TREASURE;
    }

    if (!form.location) return 0;

    return PRICES[form.location]?.[form.stallType] || 0;
  };

  const stallPrice = getStallPrice();
  const electricPrice = form.electric ? PRICES.ELECTRIC : 0;
  const totalAmount = stallPrice + electricPrice;

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.sapId ||
      !form.course ||
      !form.branch ||
      !form.stallType
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!form.terms) {
      alert("Please accept terms & conditions");
      return;
    }

    await addDoc(collection(db, "registrations"), {
      ...form,
      stallPrice,
      electricPrice,
      totalAmount,
      paid: false,
      createdAt: serverTimestamp(),
    });

    navigate("/thanks");
  };

  /* ================= UI ================= */
  return (
    <div style={{ minHeight: "100vh", padding: 16, background: "#f8fafc" }}>
      <h1 style={{ textAlign: "center", color: "#2563eb" }}>
        Festum Registration
      </h1>

      <div
        style={{
          maxWidth: 1200,
          margin: "auto",
          background: "#fff",
          border: "2px solid #2563eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        {/* STUDENT DETAILS */}
        <h3>Student Details</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
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
            <option value="CSE">Computer Science</option>
            <option value="EXTC">EXTC</option>
            <option value="Civil">Civil</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
            <option value="Plastic">Plastic</option>
            <option value="AIML">AIML</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>

        {/* STALL DETAILS */}
        <h3 style={{ marginTop: 24 }}>Stall Details</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <select name="stallType" value={form.stallType} onChange={handleChange}>
            <option value="">Stall Type</option>
            <option value="FOOD_1">1 Food Stall (3 members)</option>
            <option value="FOOD_2">2 Food Stalls (3+1 members)</option>
            <option value="GAME">Game Stall (2 members)</option>
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
          <input
            style={{ width: "100%", marginTop: 12 }}
            placeholder={getStallLabel()}
            name="stallName"
            onChange={handleChange}
          />
        )}

        {form.stallType !== "TREASURE" && (
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
              fontSize: 15,
            }}
          >
            <span>Electric Plug Point Required (₹350)</span>
            <input
              type="checkbox"
              name="electric"
              checked={form.electric}
              onChange={handleChange}
              style={{ width: 18, height: 18 }}
            />
          </label>
        )}

        {/* AMOUNT SUMMARY */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            border: "2px dashed #2563eb",
            borderRadius: 16,
            background: "#f8fafc",
          }}
        >
          <h3>Amount Summary</h3>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Stall Price</span>
            <span>₹{stallPrice}</span>
          </div>

          {form.electric && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Electric Plug Point</span>
              <span>₹{electricPrice}</span>
            </div>
          )}

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 700,
              color: "#2563eb",
            }}
          >
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* TERMS */}
        <label
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            style={{ width: 18, height: 18 }}
          />
          I accept all Festum rules & conditions
        </label>

        <button
          onClick={submit}
          style={{
            marginTop: 24,
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Submit Registration
        </button>
      </div>
    </div>
  );
}

export default Register;
