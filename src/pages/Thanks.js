import "../App.css";

function Thanks() {
  return (
    <div className="App">
      <h1>Thank You 🙏</h1>

      <div className="form-card" style={{ textAlign: "center" }}>
        <h2>Registration Successful ✅</h2>

        <p style={{ marginTop: 20 }}>
          💰 Please pay the amount at the desk.
        </p>

        <p>
          Our team will mark your payment after collection.
        </p>
      </div>
    </div>
  );
}

export default Thanks;
