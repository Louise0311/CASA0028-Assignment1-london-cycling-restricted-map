import React, { useState, useEffect, useMemo } from 'react';
import MapDisplay from './components/MapDisplay.jsx';
import SummaryChart from './components/SummaryChart';

function App() {
  // Define state to store features from restricted_point.json
  const [pointData, setPointData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filterBorough, setFilterBorough] = useState('All');

  useEffect(() => {
    // Fetching the local GeoJSON data from public folder [cite: 589, 1317]
    fetch('/restricted_point.json')
      .then((res) => res.json())
      .then((data) => {
        console.log("Data loaded successfully:", data.features); 
        setPointData(data.features);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  // Use useMemo for data filtering (Week 5: Data manipulation)
  const filteredData = useMemo(() => {
    if (filterBorough === 'All') return pointData;
    return pointData.filter(f => f.properties.BOROUGH === filterBorough);
  }, [filterBorough, pointData]);

  // Retrieve all unique administrative district names for the dropdown list
  const boroughs = ['All', ...new Set(pointData.map(f => f.properties.BOROUGH))].sort();


const chartData = useMemo(() => {
  // 1. statistics each borough amount
  const counts = {};
  pointData.forEach(f => {
    const b = f.properties.BOROUGH;
    counts[b] = (counts[b] || 0) + 1;
  });

  const allBoroughs = Object.keys(counts).sort();

  return {
    labels: allBoroughs,
    datasets: [
      {
        label: 'Number of Points',
        data: allBoroughs.map(b => counts[b]),
        // 2. based on filterBorough made color (Week 5: Arrays for colors)
        backgroundColor: allBoroughs.map(b => 
          b === filterBorough ? 'rgba(231, 76, 60, 0.8)' : 'rgba(54, 162, 235, 0.5)'
        ),
        borderColor: allBoroughs.map(b => 
          b === filterBorough ? 'rgba(231, 76, 60, 1)' : 'rgba(54, 162, 235, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };
}, [pointData, filterBorough]); 


  return (
  /* 1. Outer container: Ensures it occupies the entire screen height and allows vertical scrolling. */
  <div style={{ width: '100vw', height: '100vh', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
    
    <header style={{ padding: '15px', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ margin: 0, fontSize: '1.2rem' }}>London Cycling Barriers Map</h1>
      
      {/* The filter remains unchanged */}
      <div style={{ background: '#fff', padding: '5px 10px', borderRadius: '4px', color: '#333' }}>
        <label htmlFor="borough-select" style={{ marginRight: '8px', fontWeight: 'bold' }}>Borough: </label>
        <select id="borough-select" value={filterBorough} onChange={(e) => setFilterBorough(e.target.value)}>
          {boroughs.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </header>

    {/* 2. Map area: Give it a fixed height, for example, 70% of the screen. */}
    <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
      <MapDisplay 
        bikePoints={filteredData} 
        selectedPoint={selectedPoint} 
        setSelectedPoint={setSelectedPoint} 
      />
    </div>

    {/* 3. Chart area: Arranged naturally below the map */}
    <div style={{ padding: '40px 20px', width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', 
                  flexDirection: 'column', alignItems: 'center', background: '#fff'}}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Data Insights</h2>
      <div style={{ width: '100%', height: '400px', position: 'relative' }}>
        <SummaryChart chartData={chartData} />
      </div>
  
      <p style={{ 
        marginTop: '30px', textAlign: 'center', color: '#333', maxWidth: '800px', lineHeight: '1.6' }}>
        <strong>Statistical Insight:</strong> {filterBorough === 'All' 
          ? "Across London, the distribution of cycling barriers varies significantly by district." 
          : `In ${filterBorough}, there are specifically recorded restricted points that impact local cycling infrastructure.`}
      </p>
    </div>

  </div>
);
}

export default App;