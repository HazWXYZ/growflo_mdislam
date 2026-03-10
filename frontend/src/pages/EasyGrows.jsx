// hardcoded list of easy beginner plants - could be from the API but
// these are reliable picks so I kept them static

const easyPlants = [
  {
    id: 1,
    emoji: '🪴',
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    whyEasy: 'Practically indestructible. Tolerates low light, irregular watering, and neglect better than almost any other plant.',
    tips: [
      { icon: '💧', text: 'Water every 1-2 weeks, let it dry out between' },
      { icon: '☀️', text: 'Tolerates low to bright indirect light' },
      { icon: '🌡️', text: 'Happy in normal room temps (60-85°F)' },
    ],
  },
  {
    id: 2,
    emoji: '🌵',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    whyEasy: "Often called the 'impossible to kill' plant. Perfect for beginners or people who travel a lot. Purifies the air too.",
    tips: [
      { icon: '💧', text: 'Water once a month in winter, every 2 weeks in summer' },
      { icon: '☀️', text: 'Almost any light will do, even artificial' },
      { icon: '🪨', text: 'Well-draining soil is key, avoid overwatering' },
    ],
  },
  {
    id: 3,
    emoji: '🌿',
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    whyEasy: "Grows fast, looks great on a windowsill, and you can eat it! One of the most rewarding beginner plants if you cook.",
    tips: [
      { icon: '💧', text: 'Keep soil moist but not soggy' },
      { icon: '☀️', text: 'Needs 6+ hours of sun daily, south-facing window works great' },
      { icon: '✂️', text: 'Pinch off flowers to keep leaves growing' },
    ],
  },
  {
    id: 4,
    emoji: '🌺',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    whyEasy: 'A succulent that thrives on neglect. Bonus: the gel inside is useful for minor burns and skin irritation.',
    tips: [
      { icon: '💧', text: 'Water deeply but infrequently — every 3 weeks or so' },
      { icon: '☀️', text: 'Bright, indirect sunlight or a sunny windowsill' },
      { icon: '🪨', text: 'Sandy or cactus mix soil, needs great drainage' },
    ],
  },
  {
    id: 5,
    emoji: '🍅',
    name: 'Cherry Tomatoes',
    scientificName: 'Solanum lycopersicum var. cerasiforme',
    whyEasy: 'The best starter veggie. Grows quickly, produces a ton of fruit, and is very rewarding to harvest and eat.',
    tips: [
      { icon: '💧', text: 'Water consistently — try to keep soil evenly moist' },
      { icon: '☀️', text: 'Need full sun, at least 6-8 hours per day' },
      { icon: '🌱', text: 'Stake them as they grow, they get tall!' },
    ],
  },
];

function EasyGrows() {
  return (
    <div>
      <div className="page-header">
        <h1>🌱 Easy Grows</h1>
        <p>Five plants that are perfect for beginners — low maintenance, high reward</p>
      </div>

      <div className="easy-grows-page">
        <p style={{ color: 'var(--text-mid)', marginBottom: '0.5rem', fontSize: '0.97rem' }}>
          Whether you're setting up your first indoor garden or trying something new in the
          backyard, these five plants are the best place to start. They're forgiving, fast-growing,
          and will actually make you feel like you know what you're doing.
        </p>

        <div className="easy-grows-grid">
          {easyPlants.map((plant) => (
            <div key={plant.id} className="easy-grow-card">
              <div className="easy-grow-card-top">{plant.emoji}</div>
              <div className="easy-grow-card-body">
                <h3>{plant.name}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  {plant.scientificName}
                </p>
                <p className="why-easy">{plant.whyEasy}</p>

                <div className="easy-grow-tips">
                  {plant.tips.map((tip, i) => (
                    <div key={i} className="easy-grow-tip">
                      <span className="tip-icon">{tip.icon}</span>
                      <span>{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.88rem', marginTop: '2rem' }}>
          Want to learn more about any of these? Try searching for them on the Home page!
        </p>
      </div>
    </div>
  );
}

export default EasyGrows;
