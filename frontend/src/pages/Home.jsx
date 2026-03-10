import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// modal to name the plant before tracking it
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

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  // which plant is being added to tracker
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [addSuccess, setAddSuccess] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);
    setResults([]);

    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.data || []);
    } catch (err) {
      setError('Search failed. Make sure the backend is running and your API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPlant = async (nickname) => {
    if (!user) return;

    try {
      const token = user.token;
      // build the tracker entry from what we got back from the API
      const sunlight = selectedPlant.sunlight
        ? selectedPlant.sunlight[0]
        : 'Full Sun';

      await axios.post(
        '/api/plants',
        {
          name: nickname,
          plantName: selectedPlant.common_name,
          age: '1 week',
          environment: 'Outdoor',
          sunshine: sunlight,
          lastWatered: new Date().toISOString().split('T')[0],
          size: 'Seedling',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedPlant(null);
      setAddSuccess(`"${nickname}" added to your tracker!`);
      setTimeout(() => setAddSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const formatSunlight = (sunlight) => {
    if (!sunlight) return null;
    if (Array.isArray(sunlight)) {
      if (sunlight.length === 0) return null;
      return sunlight.join(', ');
    }
    // sometimes the API returns it as a plain string
    return sunlight;
  };

  return (
    <div>
      {/* hero search section */}
      <div className="home-hero">
        <h1>🌿 GrowFlo</h1>
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

      {/* results */}
      <div className="search-results-section">
        {addSuccess && <div className="alert-success">{addSuccess} <button
          style={{ background: 'none', border: 'none', color: 'var(--green-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}
          onClick={() => navigate('/tracker')}
        >View Tracker →</button></div>}

        {error && <div className="alert-error">{error}</div>}

        {loading && <p className="loading-text">Searching plants...</p>}

        {!loading && searched && results.length === 0 && !error && (
          <p className="loading-text">No plants found for "{query}". Try a different search!</p>
        )}

        {results.length > 0 && (
          <>
            <h2>Results for "{query}"</h2>
            <div className="plant-cards-grid">
              {results.slice(0, 12).map((plant) => (
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
                    <p className="scientific-name">
                      {plant.scientific_name?.[0] || ''}
                    </p>

                    <div className="plant-info-badges">
                      {plant.watering && (
                        <span className="badge badge-water">
                          💧 {plant.watering}
                        </span>
                      )}
                      {formatSunlight(plant.sunlight) && (
                        <span className="badge badge-sun">
                          ☀️ {formatSunlight(plant.sunlight)}
                        </span>
                      )}
                      {plant.pruning_month && plant.pruning_month.length > 0 && (
                        <span className="badge badge-prune">
                          ✂️ Prune: {plant.pruning_month.slice(0, 2).join(', ')}
                        </span>
                      )}
                      {!plant.watering && (!plant.sunlight || plant.sunlight.length === 0) && (!plant.pruning_month || plant.pruning_month.length === 0) && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                          No care data available
                        </span>
                      )}
                    </div>

                    {user ? (
                      <button
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '0.85rem' }}
                        onClick={() => setSelectedPlant(plant)}
                      >
                        + Track This Plant
                      </button>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
                        Log in to track this plant
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* show something on the homepage before any search */}
        {!searched && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
              Type a plant name above and press Search or hit Enter
            </p>
          </div>
        )}
      </div>

      {/* naming modal */}
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
