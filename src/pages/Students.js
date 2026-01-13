import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

/* ================= PRICES (SAME AS REGISTER) ================= */
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

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [collector, setCollector] = useState({});

  /* ================= ADMIN PROTECTION ================= */
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin !== "true") navigate("/login");
  }, [navigate]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const snap = await getDocs(collection(db, "registrations"));
    setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* ================= PRICE CALCULATION ================= */
  const calculateTotal = (s) => {
    let base = 0;

    if (s.stallType === "TREASURE") {
      base = PRICES.TREASURE;
    } else if (s.location) {
      base = PRICES[s.location]?.[s.stallType] || 0;
    }

    const electric = s.electric ? PRICES.ELECTRIC : 0;

    return base + electric;
  };

  /* ================= MARK AS PAID ================= */
  const markPaid = async (s) => {
    if (!collector[s.id]) {
      alert("Please select who collected money");
      return;
    }

    const finalAmount = calculateTotal(s);

    await updateDoc(doc(db, "registrations", s.id), {
      paid: true,
      collectedBy: collector[s.id],
      finalAmount,
    });

    fetchStudents();
  };

  /* ================= DELETE ================= */
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await deleteDoc(doc(db, "registrations", id));
    fetchStudents();
  };

  /* ================= SEARCH ================= */
  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.sapId?.includes(search)
  );

  /* ================= COUNTS ================= */
  const totalCount = students.length;
  const paidCount = students.filter((s) => s.paid).length;
  const unpaidCount = totalCount - paidCount;

  /* ================= LOGOUT ================= */
  const logout = () => {
    sessionStorage.removeItem("admin");
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <div className="App">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Festum Registrations</h1>
        <button className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      {/* COUNTS */}
      <p>
        👥 Total: {totalCount} | ✅ Paid: {paidCount} | ❌ Unpaid: {unpaidCount}
      </p>

      {/* SEARCH */}
      <input
        placeholder="Search by Name or SAP ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {/* LIST */}
      {filtered.map((s, i) => (
        <div key={s.id} className="form-card" style={{ marginBottom: 20 }}>
          <b>
            {i + 1}. {s.name}
          </b>
          <br />
          📞 Phone: {s.phone}
          <br />
          🆔 SAP ID: {s.sapId}
          <br />
          🎓 Course: {s.course}
          <br />
          🧑‍🎓 Branch: {s.branch}
          <br />
          📘 Semester: {s.semester}
          <br />
          📄 Roll No: {s.rollNo}
          <br />
          <br />

          🏷 Stall Type: <b>{s.stallType}</b>
          <br />
          📝 Stall Name: <b>{s.stallName || "N/A"}</b>
          <br />
          📍 Location: {s.location || "N/A"}
          <br />
          🔌 Electric Plug: {s.electric ? "Yes" : "No"}
          <br />
          <br />

          <b>💰 Total Amount: ₹{calculateTotal(s)}</b>
          <br />
          <br />

          {/* PAID STATUS */}
          {s.paid ? (
            <p style={{ color: "#22c55e" }}>
              ✅ PAID <br />
              👤 Collected By: {s.collectedBy}
            </p>
          ) : (
            <>
              <select
                value={collector[s.id] || ""}
                onChange={(e) =>
                  setCollector({ ...collector, [s.id]: e.target.value })
                }
              >
                <option value="">Collected By</option>
                <option value="Param">Param</option>
                <option value="Yash">Yash</option>
                <option value="Vrinda">Vrinda</option>
              </select>

              <br />
              <br />

              <button className="btn-primary" onClick={() => markPaid(s)}>
                Mark as Paid
              </button>
            </>
          )}

          <br />
          <br />
          <button
            className="btn-secondary"
            onClick={() => deleteStudent(s.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Students;
