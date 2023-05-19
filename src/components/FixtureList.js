import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  // Group fixtures by date
  const groupedFixtures = fixtures.reduce((groups, fixture) => {
    const date = fixture.fixture.date.split('T')[0]; // extract date part
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(fixture);
    return groups;
  }, {});

  return (
    <div>
      <h1>Fixtures</h1>
      {Object.entries(groupedFixtures).map(([date, fixtures]) => (
        <Accordion key={date}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {fixtures.map((fixture) => (
              <Card key={fixture.fixture.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Link to={`/fixture/${fixture.fixture.id}`}>{fixture.teams.home.name} vs {fixture.teams.away.name}</Link>
                </CardContent>
              </Card>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default FixtureList;
