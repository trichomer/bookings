import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FixtureList() {
  const [fixtures, setFixtures] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/fixtures?league=140&season=2022', {
          headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
        });
        setFixtures(response.data.response);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!fixtures) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Fixtures</h1>
      {fixtures.map((fixture) => (
        <div key={fixture.fixture.id}>
          <Link to={`/fixture/${fixture.fixture.id}`}>{fixture.teams.home.name} vs {fixture.teams.away.name}</Link>
        </div>
      ))}
    </div>
  );
}

export default FixtureList;
