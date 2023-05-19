import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FixtureList() {
  const [fixtures, setFixtures] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseLaLiga = await axios.get('/fixtures?league=140&season=2022', {
          headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
        });
        const responseSerieA = await axios.get('/fixtures?league=135&season=2022', {
          headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
        });
        const combinedFixtures = [...responseLaLiga.data.response, ...responseSerieA.data.response];
        setFixtures(combinedFixtures);
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

  const fixturesByDate = Object.entries(groupedFixtures);

  return (
    <div>
      <h1>Fixtures</h1>
      {fixturesByDate.map(([date, fixturesOnDate], index) => (
        <Accordion key={date} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography>{date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {fixturesOnDate.map((fixture) => (
                <Link to={`/fixture/${fixture.fixture.id}`} key={fixture.fixture.id} style={{ textDecoration: 'none' }}>
                  <Card style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={fixture.teams.home.logo} alt={`${fixture.teams.home.name} logo`} style={{ width: '50px', marginRight: '10px' }}/>
                      <Typography>{fixture.teams.home.name}</Typography>
                      <Typography style={{ margin: '0 10px' }}>vs</Typography>
                      <Typography>{fixture.teams.away.name}</Typography>
                      <img src={fixture.teams.away.logo} alt={`${fixture.teams.away.name} logo`} style={{ width: '50px', marginLeft: '10px' }}/>
                    </CardContent>
                  </Card>
                </Link>
            ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default FixtureList;
