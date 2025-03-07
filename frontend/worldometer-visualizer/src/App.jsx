import LiveHorizontalChart from "./components/LiveHorizontalChart";

function App() {
  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>🌍 Live World Population</h1>
      <LiveHorizontalChart />
    </div>
  );
}

export default App;


