import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const isUpgrade = (val) =>
  typeof val === 'string' && val.toLowerCase().includes('upgrade');

// exact watering values from the Perenual API: frequent, average, minimum, none
const WATER_LEVELS = {
  'frequent': { label: '💧💧💧 Frequent', bg: '#fee2e2', color: '#b91c1c' },
  'average':  { label: '💧💧 Average',    bg: '#dbeafe', color: '#1d4ed8' },
  'minimum':  { label: '💧 Minimum',      bg: '#e0f2fe', color: '#0369a1' },
  'none':     { label: '🚫 None',         bg: '#f1f5f9', color: '#64748b' },
};

// exact sunlight values from the Perenual API: full_shade, part_shade, sun-part_shade, full_sun
const SUN_LEVELS = {
  'full_sun':       { label: '☀️ Full Sun',       bg: '#fef3c7', color: '#92400e' },
  'sun-part_shade': { label: '🌤️ Sun-Part Shade', bg: '#fef9c3', color: '#a16207' },
  'part_shade':     { label: '⛅ Part Shade',      bg: '#dcfce7', color: '#166534' },
  'full_shade':     { label: '🌑 Full Shade',      bg: '#e2e8f0', color: '#334155' },
};

const getWaterStyle = (watering) => {
  if (!watering || isUpgrade(watering)) return null;
  const key = watering.toLowerCase().trim();
  return WATER_LEVELS[key] || { label: `💧 ${watering}`, bg: '#dbeafe', color: '#1d4ed8' };
};

const getSunStyles = (sunlight) => {
  if (!sunlight) return [];
  const arr = Array.isArray(sunlight) ? sunlight : [sunlight];
  return arr
    .filter((s) => s && !isUpgrade(s))
    .map((s) => {
      const key = s.toLowerCase().trim().replace(/\s+/g, '_');
      return SUN_LEVELS[key] || { label: `☀️ ${s}`, bg: '#fef9c3', color: '#a16207' };
    });
};

// cycle badge colors
const CYCLE_STYLES = {
  'perennial':  { label: '🔄 Perennial',  bg: '#dcfce7', color: '#166534' },
  'annual':     { label: '1️⃣ Annual',     bg: '#fef9c3', color: '#a16207' },
  'biennial':   { label: '2️⃣ Biennial',   bg: '#ede9fe', color: '#5b21b6' },
  'biannual':   { label: '2️⃣ Biannual',   bg: '#ede9fe', color: '#5b21b6' },
};

const getCycleStyle = (cycle) => {
  if (!cycle || isUpgrade(cycle)) return null;
  const key = cycle.toLowerCase().trim();
  return CYCLE_STYLES[key] || { label: `🔄 ${cycle}`, bg: '#dcfce7', color: '#166534' };
};

// hardiness zone — returns a colored label based on zone number
const getHardinessStyle = (min, max) => {
  if (!min && !max) return null;
  const zone = min || max;
  // zones 1-4 cold, 5-7 moderate, 8-10 warm, 11-13 tropical
  if (zone <= 4)  return { label: `❄️ Zone ${min}–${max}`, bg: '#e0f2fe', color: '#0369a1' };
  if (zone <= 7)  return { label: `🌿 Zone ${min}–${max}`, bg: '#dcfce7', color: '#166534' };
  if (zone <= 10) return { label: `☀️ Zone ${min}–${max}`, bg: '#fef3c7', color: '#92400e' };
  return           { label: `🌴 Zone ${min}–${max}`, bg: '#fde8e2', color: '#c2410c' };
};

// ---- Name modal ----
function NamePlantModal({ plant, onClose, onConfirm }) {
  const [nickname, setNickname] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="name-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Name Your Plant 🌱</h2>
        <p>
          You're adding <strong>{plant.common_name}</strong> to your tracker.
          Give it a nickname!
        </p>
        <input
          type="text"
          placeholder="e.g. Porch Plant, Office Buddy..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && nickname && onConfirm(nickname)}
          autoFocus
        />
        <div className="form-actions">
          <button
            className="btn-primary"
            onClick={() => nickname && onConfirm(nickname)}
            disabled={!nickname.trim()}
          >
            Start Tracking!
          </button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---- Care badge component ----
function CareBadge({ bg, color, label }) {
  return (
    <span
      className="care-badge"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

// ---- Main Home ----
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [details, setDetails] = useState({}); // keyed by plant id
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [addSuccess, setAddSuccess] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    setResults([]);
    setDetails({});

    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      const plants = res.data.data || [];
      setResults(plants);
      setLoading(false);

      // fetch details for all results in parallel
      // the upgrade-message filter handles any locked fields gracefully
      const toFetch = plants.slice(0, 12);
      if (toFetch.length > 0) {
        setLoadingDetails(true);
        const detailRequests = toFetch.map((p) =>
          axios.get(`/api/search/details/${p.id}`)
            .then((r) => ({ id: p.id, data: r.data }))
            .catch((err) => {
              console.warn(`details fetch failed for id ${p.id}:`, err.message);
              return null;
            })
        );
        const settled = await Promise.all(detailRequests);
        const detailMap = {};
        settled.forEach((item) => {
          if (item) detailMap[item.id] = item.data;
        });
        console.log('[details map]', detailMap);
        setDetails(detailMap);
        setLoadingDetails(false);
      }
    } catch (err) {
      setError('Search failed. Make sure the backend is running and your API key is set.');
      setLoading(false);
    }
  };

  const handleTrackPlant = async (nickname) => {
    if (!user) return;
    try {
      const d = details[selectedPlant.id];
      const sunlightRaw = d?.sunlight || selectedPlant.sunlight;
      const sunshine = sunlightRaw
        ? Array.isArray(sunlightRaw) ? sunlightRaw[0] : sunlightRaw
        : 'Full Sun';

      await axios.post(
        '/api/plants',
        {
          name: nickname,
          plantName: selectedPlant.common_name,
          age: '1 week',
          environment: 'Outdoor',
          sunshine,
          lastWatered: new Date().toISOString().split('T')[0],
          size: 'Seedling',
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSelectedPlant(null);
      setAddSuccess(`"${nickname}" added to your tracker!`);
      setTimeout(() => setAddSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="home-hero">
        <h1>GrowFlo</h1>
        <p className="tagline">
          Search any plant and learn how to care for it. Then track your own garden!
        </p>
        <div className="search-bar-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search a plant... e.g. tomato, lavender"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-accent" onClick={handleSearch} disabled={loading}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="search-results-section">
        {addSuccess && (
          <div className="alert-success">
            {addSuccess}{' '}
            <button
              style={{ background: 'none', border: 'none', color: 'var(--green-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}
              onClick={() => navigate('/tracker')}
            >
              View Tracker →
            </button>
          </div>
        )}

        {error && <div className="alert-error">{error}</div>}
        {loading && <p className="loading-text">Searching plants...</p>}

        {!loading && searched && results.length === 0 && !error && (
          <p className="loading-text">No plants found for "{query}". Try a different search!</p>
        )}

        {results.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>Results for "{query}"</h2>
              {loadingDetails && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                  Loading care data...
                </span>
              )}
            </div>

            <div className="plant-cards-grid">
              {results.slice(0, 12).map((plant) => {
                const d = details[plant.id];
                const watering = d?.watering || plant.watering;
                const sunlight = d?.sunlight || plant.sunlight;
                const waterStyle = getWaterStyle(watering);
                const sunStyles = getSunStyles(sunlight);
                const hasCareData = waterStyle || sunStyles.length > 0;

                return (
                  <div key={plant.id} className="plant-card">
                    {plant.default_image?.small_url ? (
                      <img
                        className="plant-card-img"
                        src={plant.default_image.small_url}
                        alt={plant.common_name}
                      />
                    ) : (
                      <div className="plant-card-img-placeholder">🌱</div>
                    )}

                    <div className="plant-card-body">
                      <h3>{plant.common_name || 'Unknown Plant'}</h3>
                      <p className="scientific-name">{plant.scientific_name?.[0] || ''}</p>

                      <div className="plant-care-section">
                        {!d && loadingDetails ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                            Loading care info...
                          </span>
                        ) : hasCareData ? (
                          <>
                            {waterStyle && (
                              <div className="care-row">
                                <span className="care-row-label">Water</span>
                                <CareBadge {...waterStyle} />
                              </div>
                            )}
                            {sunStyles.length > 0 && (
                              <div className="care-row">
                                <span className="care-row-label">Sun</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {sunStyles.map((s, i) => (
                                    <CareBadge key={i} {...s} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : null}

                        {/* edible / cycle / hardiness — shown whenever detail data exists */}
                        {d && (() => {
                          const cycleStyle = getCycleStyle(d.cycle);
                          const hardinessStyle = getHardinessStyle(d.hardiness?.min, d.hardiness?.max);
                          const edible = d.edible_fruit || d.edible;
                          const poisonous = d.poisonous;
                          return (
                            <>
                              {cycleStyle && (
                                <div className="care-row">
                                  <span className="care-row-label">Cycle</span>
                                  <CareBadge {...cycleStyle} />
                                </div>
                              )}
                              {hardinessStyle && (
                                <div className="care-row">
                                  <span className="care-row-label">Zone</span>
                                  <CareBadge {...hardinessStyle} />
                                </div>
                              )}
                              {(edible !== null && edible !== undefined) && (
                                <div className="care-row">
                                  <span className="care-row-label">Edible</span>
                                  <CareBadge
                                    label={edible ? '✅ Edible' : '🚫 Not Edible'}
                                    bg={edible ? '#dcfce7' : '#fee2e2'}
                                    color={edible ? '#166534' : '#b91c1c'}
                                  />
                                  {poisonous && (
                                    <CareBadge label="☠️ Poisonous" bg="#fde8e2" color="#c0392b" />
                                  )}
                                </div>
                              )}
                            </>
                          );
                        })()}

                        {!d && !loadingDetails && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                            No care data available
                          </span>
                        )}
                      </div>

                      {user ? (
                        <button
                          className="btn-primary"
                          style={{ width: '100%', fontSize: '0.85rem', marginTop: '0.8rem' }}
                          onClick={() => setSelectedPlant(plant)}
                        >
                          + Track This Plant
                        </button>
                      ) : (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '0.8rem' }}>
                          Log in to track this plant
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!searched && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
              Type a plant name above and press Search or hit Enter
            </p>
          </div>
        )}
      </div>

      {selectedPlant && (
        <NamePlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onConfirm={handleTrackPlant}
        />
      )}
    </div>
  );
}

export default Home;
