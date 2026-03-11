function About() {
  return (
    <div>
      <div className="page-header">
        <h1>About GrowFlo</h1>
        <p>Making growing simple for everyone</p>
      </div>

      <div className="about-page">
        <div className="about-section">
          <h2>What is GrowFlo?</h2>
          <p>
            GrowFlo is a plant care companion that helps you search for plants, understand
            how to care for them, and track the ones you're actually growing. Whether you
            have one succulent on a desk or a full vegetable garden in the backyard, GrowFlo
            keeps everything organized in one place.
          </p>
          <p>
            The goal was simple: make growing accessible. A lot of plant apps are
            overwhelming or try to do too much. GrowFlo focuses on what actually matters —
            finding care info quickly and keeping notes on how your plants are doing.
          </p>
        </div>

        <div className="about-section">
          <h2>What Can You Do Here?</h2>
          <p style={{ marginTop: '1.2rem' }}>
            Use the search on the home page to look up any plant and see its watering needs,
            sunlight requirements, and pruning schedule. Then add it to your tracker to log
            details like how old it is, where you keep it, and when you last watered it.
          </p>
        </div>

        <div className="about-section">
          <h2>Plant Data</h2>
          <p>
            GrowFlo uses the <strong>Perenual Plant API</strong> to pull real care data for
            thousands of plant species. The database includes watering frequency, sunlight
            requirements, pruning months, and more — all from a reliable, curated source.
          </p>
          <p>
            Your tracker data is stored securely in a MongoDB database, so your garden log
            will be there every time you log back in.
          </p>
        </div>


      </div>
    </div>
  );
}

export default About;
