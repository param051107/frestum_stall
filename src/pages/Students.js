import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [collector, setCollector] = useState({});

  // 🔐 Admin protection
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin !== "true") navigate("/login");
  }, [navigate]);

  // 📥 Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const snap = await getDocs(collection(db, "registrations"));
    setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  // 💰 TOTAL PRICE CALCULATION (CASE SAFE)
  const calculateTotal = (s) => {
    let base = 0;
    const stall = (s.stallType || "").toLowerCase();

    if (stall === "food") base = 300;
    else if (stall === "game") base = 600;
    else if (stall === "both") base = 900;

    const extraTables = Number(s.extraTables || 0);
    const electricBoards = Number(s.electricBoards || 0);

    return base + (extraTables + electricBoards) * 100;
  };

  // ✅ Mark as Paid
  const markPaid = async (s) => {
    if (!collector[s.id]) {
      alert("Please select who collected money");
      return;
    }

    await updateDoc(doc(db, "registrations", s.id), {
      paid: true,
      collectedBy: collector[s.id],
      finalAmount: calculateTotal(s)
    });

    fetchStudents();
  };

  // 🗑 Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await deleteDoc(doc(db, "registrations", id));
    fetchStudents();
  };

  // 🔎 Search filter
  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.sapId?.includes(search)
  );

  // 📊 Counters
  const totalCount = students.length;
  const paidCount = students.filter(s => s.paid).length;
  const unpaidCount = totalCount - paidCount;

  // 🚪 Logout
  const logout = () => {
    sessionStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="App">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Registered Students</h1>
        <button className="btn-secondary" onClick={logout}>Logout</button>
      </div>

      {/* COUNTS */}
      <p>
        👥 Total: {totalCount} &nbsp; | &nbsp;
        ✅ Paid: {paidCount} &nbsp; | &nbsp;
        ❌ Unpaid: {unpaidCount}
      </p>

      {/* SEARCH */}
      <input
        placeholder="Search by Name or SAP ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {/* STUDENT CARDS */}
      {filtered.map((s, i) => (
        <div key={s.id} className="form-card" style={{ marginBottom: 25 }}>
          <b>{i + 1}. {s.name}</b><br />
          Phone: {s.phone}<br />
          SAP ID: {s.sapId}<br />
          Semester: {s.semester}<br />
          Roll No: {s.rollNo}<br />
          Course: {s.course}<br />
          Branch: {s.branch}<br />
          Students: {s.studentCount}<br />
          Stall: {s.stallType}<br />
          Extra Tables: {s.extraTables || 0}<br />
          Electric Boards: {s.electricBoards || 0}<br /><br />

          <b>🪙 Total Amount: ₹{calculateTotal(s)}</b><br /><br />

          {/* PAID SECTION */}
          {s.paid ? (
            <p style={{ color: "#22c55e" }}>
              ✅ PAID <br />
              👤 Collected by: {s.collectedBy}
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
              <br /><br />

              <button className="btn-primary" onClick={() => markPaid(s)}>
                Mark as Paid
              </button>
            </>
          )}

          <br /><br />
          <button className="btn-secondary" onClick={() => deleteStudent(s.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Students;
