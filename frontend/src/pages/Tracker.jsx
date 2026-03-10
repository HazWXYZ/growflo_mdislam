import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// form to add or edit a plant
function PlantForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      plantName: '',
      age: '',
      environment: 'Indoor',
      sunshine: 'Full Sun',
      lastWatered: '',
      size: 'Seedling',
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert('Your plant needs a name!');
      return;
    }
    onSave(form);
  };

  return (
    <div className="add-plant-form">
      <h3>{initial ? 'Edit Plant' : 'Add a New Plant'}</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Nickname *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Windowsill Basil"
          />
        </div>
        <div className="form-group">
          <label>Plant Species</label>
          <input
            name="plantName"
            value={form.plantName}
            onChange={handleChange}
            placeholder="e.g. Basil, Tomato"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Age / How Long Growing</label>
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="e.g. 3 weeks, 2 months"
          />
        </div>
        <div className="form-group">
          <label>Last Watered</label>
          <input
            type="date"
            name="lastWatered"
            value={form.lastWatered}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Environment</label>
          <select name="environment" value={form.environment} onChange={handleChange}>
            <option>Indoor</option>
            <option>Outdoor</option>
            <option>Greenhouse</option>
          </select>
        </div>
        <div className="form-group">
          <label>Sunshine</label>
          <select name="sunshine" value={form.sunshine} onChange={handleChange}>
            <option>Full Sun</option>
            <option>Partial Sun</option>
            <option>Shade</option>
            <option>Indirect Light</option>
          </select>
        </div>
      </div>

      <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="form-group">
          <label>Current Size</label>
          <select name="size" value={form.size} onChange={handleChange}>
            <option>Seedling</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSubmit}>
          {initial ? 'Save Changes' : 'Add to Tracker'}
        </button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function Tracker() {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };

  // fetch all tracked plants when page loads
  useEffect(() => {
    if (user) {
      fetchPlants();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPlants = async () => {
    try {
      const res = await axios.get('/api/plants', authHeader);
      setPlants(res.data);
    } catch (err) {
      setError('Failed to load plants');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleAdd = async (formData) => {
    try {
      const res = await axios.post('/api/plants', formData, authHeader);
      setPlants([res.data, ...plants]);
      setShowAddForm(false);
      showSuccess('Plant added to your tracker! 🌱');
    } catch (err) {
      setError('Failed to add plant');
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const res = await axios.put(`/api/plants/${id}`, formData, authHeader);
      setPlants(plants.map((p) => (p._id === id ? res.data : p)));
      setEditingId(null);
      showSuccess('Plant updated! ✏️');
    } catch (err) {
      setError('Failed to update plant');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from your tracker?`)) return;
    try {
      await axios.delete(`/api/plants/${id}`, authHeader);
      setPlants(plants.filter((p) => p._id !== id));
      showSuccess('Plant removed from tracker.');
    } catch (err) {
      setError('Failed to delete plant');
    }
  };

  // not logged in
  if (!user) {
    return (
      <div className="tracker-page">
        <div className="page-header" style={{ borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          <h1>My Plant Tracker</h1>
          <p>Keep tabs on everything you're growing</p>
        </div>
        <div className="login-prompt">
          <p>You need to be logged in to use the tracker.</p>
          <p style={{ fontSize: '0.9rem' }}>Create a free account — no email needed!</p>
        </div>
      </div>
    );
  }

  if (loading) return <p className="loading-text">Loading your plants...</p>;

  return (
    <div className="tracker-page">
      <div className="tracker-top">
        <h2>🌱 My Plant Tracker</h2>
        <button
          className="btn-primary"
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Plant'}
        </button>
      </div>

      {successMsg && <div className="alert-success">{successMsg}</div>}
      {error && <div className="alert-error">{error}</div>}

      {showAddForm && (
        <PlantForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {plants.length === 0 && !showAddForm && (
        <div className="empty-state">
          <div className="empty-icon">🪴</div>
          <p>You haven't tracked any plants yet!</p>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            Add Your First Plant
          </button>
        </div>
      )}

      {plants.map((plant) => (
        <div key={plant._id} className="tracked-plant-card">
          {editingId === plant._id ? (
            <PlantForm
              initial={{
                name: plant.name,
                plantName: plant.plantName,
                age: plant.age,
                environment: plant.environment,
                sunshine: plant.sunshine,
                lastWatered: plant.lastWatered,
                size: plant.size,
              }}
              onSave={(data) => handleUpdate(plant._id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="tracked-plant-header">
                <div>
                  <h3>{plant.name}</h3>
                  {plant.plantName && (
                    <div className="species-label">{plant.plantName}</div>
                  )}
                </div>
                <div className="tracked-plant-actions">
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => { setEditingId(plant._id); setShowAddForm(false); }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleDelete(plant._id, plant.name)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="plant-fields-grid">
                <div className="field-box">
                  <div className="field-label">Age</div>
                  <div className="field-value">{plant.age || '—'}</div>
                </div>
                <div className="field-box">
                  <div className="field-label">Environment</div>
                  <div className="field-value">{plant.environment || '—'}</div>
                </div>
                <div className="field-box">
                  <div className="field-label">Sunshine</div>
                  <div className="field-value">{plant.sunshine || '—'}</div>
                </div>
                <div className="field-box">
                  <div className="field-label">Last Watered</div>
                  <div className="field-value">{plant.lastWatered || '—'}</div>
                </div>
                <div className="field-box">
                  <div className="field-label">Size</div>
                  <div className="field-value">{plant.size || '—'}</div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Tracker;
