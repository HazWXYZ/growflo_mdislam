function Zones() {
  const zones = [
    { zone: 1,  temp: 'Below -50°F', color: '#1a6b3c' },
    { zone: 2,  temp: '-50 to -40°F', color: '#1a6b3c' },
    { zone: 3,  temp: '-40 to -30°F', color: '#2563eb' },
    { zone: 4,  temp: '-30 to -20°F', color: '#3b82f6' },
    { zone: 5,  temp: '-20 to -10°F', color: '#0891b2' },
    { zone: 6,  temp: '-10 to 0°F', color: '#16a34a' },
    { zone: 7,  temp: '0 to 10°F', color: '#15803d' },
    { zone: 8,  temp: '10 to 20°F', color: '#d97706' },
    { zone: 9,  temp: '20 to 30°F', color: '#ea580c' },
    { zone: 10, temp: '30 to 40°F', color: '#dc2626' },
    { zone: 11, temp: 'Above 40°F', color: '#9f1239' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Hardiness Zones</h1>
        <p>Find your zone to know which plants will survive your winters</p>
      </div>

      <div className="zones-page">

        <div className="zones-intro-card">
          <h2>What is a Hardiness Zone?</h2>
          <p>
            The USDA Plant Hardiness Zone Map divides the US and Canada into zones based
            on the average annual minimum winter temperature. Knowing your zone tells you
            which plants can survive year-round in your area without special protection.
          </p>
          <p>
            Lower zone numbers mean colder winters. If a plant is rated for Zone 6, it can
            survive winters down to -10°F. If you're in Zone 8, that same plant will do
            great but a Zone 9 plant might not make it through a Zone 6 winter.
          </p>
        </div>

        {/* the actual map */}
        <div className="zones-map-container">
          <img
            src="https://arboretum.harvard.edu/wp-content/uploads/2023/04/Hardiness-Zone-Map-1967-scaled.jpg"
            alt="USDA Hardiness Zone Map of the United States and Canada"
            className="zones-map-img"
          />
        </div>

        {/* zone reference table */}
        <h2 className="zones-table-title">Zone Reference</h2>
        <div className="zones-grid">
          {zones.map(({ zone, temp, emoji, color }) => (
            <div key={zone} className="zone-card" style={{ borderTop: `4px solid ${color}` }}>
              <div className="zone-number" style={{ color }}>{emoji} Zone {zone}</div>
              <div className="zone-temp">{temp}</div>
            </div>
          ))}
        </div>

        <p className="zones-footer">
          When you search for a plant on the Home page, GrowFlo shows its hardiness zone range
          so you can quickly see if it'll survive your local winters.
        </p>

      </div>
    </div>
  );
}

export default Zones;
