import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PlayerHistory = ({ playerId }) => {
  const [seasons, setSeasons] = useState([]);
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      const response = await fetch(`/players/seasons?id=${playerId}`, {
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_API_KEY
        }
      });
      const data = await response.json();

      if (data.results > 0) { // If there are any seasons for this player
        const seasons = data.response;
        setSeasons(seasons); // Store the seasons in state
      }
    };

    fetchSeasons();
  }, [playerId]);

  useEffect(() => {
    const fetchPlayerHistory = async () => {
      let dataForAllSeasons = [];

      for (let season of seasons) {
        const response = await fetch(`/players?id=${playerId}&season=${season}`, {
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_API_KEY
          }
        });
        const data = await response.json();

        if (data.results > 0) { // If the player was active this season
          dataForAllSeasons.push(...data.response);
        }
      }

      setPlayerData(dataForAllSeasons); // Store the data in state
    };

    if (seasons.length > 0) { // Only fetch the player history if we have the seasons
      fetchPlayerHistory();
    }
  }, [playerId, seasons]);

  return (
    <div>
      {playerData.map((data, index) => (
        <Accordion key={index} expanded={index === 0 ? true : false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <h3>{data.season}</h3>
          </AccordionSummary>
          <AccordionDetails>
            {/* Add the player data for the season here */}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default PlayerHistory;
