import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

function LeagueList() {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      const leagues = [
        135, // Serie A
        140, // La Liga
      ];
      const fetchTeams = async () => {
        try {
          const allTeams = [];
          for (let i = 0; i < leagues.length; i++) {
            const response = await axios.get(`/teams?league=${leagues[i]}&season=2022`, {
              headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
            });
            allTeams.push(...response.data.response);
          }
          setTeams(allTeams);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchTeams();
    }, []);
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (!teams.length) {
        return <div>Loading...</div>;
      }

    return(
        <div>
            <h1>Teams</h1>
                {teams.map((team, index) => (
                  <Card 
                    key={index} 
                    style={{ marginBottom: '10px' }}
                  >
                    <CardContent>
                      <img 
                        src={`https://media.api-sports.io/football/teams/${team.team.id}.png`}
                        alt={`${team.team.name} Logo`} 
                        style={{ width: '50px', marginRight: '10px' }}
                      />
                      <Typography>
                        {team.team.name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
        </div>
    );
}

export default LeagueList;