import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LiveHorizontalChart = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchPopulation = async () => {
      try {
        const res = await axios.get("http://localhost:5000/data");
        console.log("Fetched Data:", res.data);
  
        const rawPopulation = res.data.population.replace(/,/g, "").trim();
  
        // Prevent adding invalid values to the chart
        if (isNaN(rawPopulation) || rawPopulation === "retrieving data..." || rawPopulation === "Error fetching data") {
          console.warn("⚠️ Invalid population data received:", res.data.population);
          return;
        }
  
        const newPopulation = parseInt(rawPopulation, 10);
        console.log("✅ Parsed Population:", newPopulation);
  
        const timestamp = new Date().toLocaleTimeString();
        setDataPoints((prev) => (prev.length >= 20 ? [...prev.slice(1), newPopulation] : [...prev, newPopulation]));
        setLabels((prev) => (prev.length >= 20 ? [...prev.slice(1), timestamp] : [...prev, timestamp]));
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };
  
    fetchPopulation();
    const interval = setInterval(fetchPopulation, 30000);
    return () => clearInterval(interval);
  }, []);

    
  const chartData = {
    labels,
    datasets: [
      {
        label: "World Population",
        data: dataPoints,
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // Makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500, // Smooth transition
    },
    scales: {
      x: {
        beginAtZero: true,
        suggestedMax: Math.max(...dataPoints, 8000000000),
      },
    },
  };
  if (dataPoints.length === 0) {
    return <h3 style={{ color: "white", textAlign: "center" }}>Waiting for data...</h3>;
  }
  return (
    <div style={{ width: "90%", height: "300px", margin: "auto", padding: "20px" }}>
      <h2 style={{ color: "white", textAlign: "center" }}>Live Population Chart</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default LiveHorizontalChart;

