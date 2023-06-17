import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

function LeagueList() {
    const [teamsByLeague, setTeamsByLeague] = useState({});
    const [error, setError] = useState(null);

    // Map leagueId -> League Names
    const leagueNames = {
      135: 'Serie A',
      140: 'La Liga',
    };

    useEffect(() => {
      
      const leagues = [
        135, // Serie A
        140, // La Liga
      ];
      const fetchTeams = async () => {
        try {
          const allTeams = {};
          for (let i = 0; i < leagues.length; i++) {
            const response = await axios.get(`/teams?league=${leagues[i]}&season=2022`, {
              headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
            });
            allTeams[leagues[i]] = response.data.response;
          }
          console.log(allTeams);
          setTeamsByLeague(allTeams);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchTeams();
    }, []);
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (Object.keys(teamsByLeague).length === 0) {
        return <div>Loading...</div>;
      }

      return (
        <div>
            <h1>Teams</h1>
            {Object.keys(teamsByLeague).map((leagueId, index) => (
              <div key={index}>
                <h2>{leagueNames[leagueId]}</h2>
                {teamsByLeague[leagueId].map((team, teamIndex) => (
                  <Card 
                    key={teamIndex} 
                    style={{ marginBottom: '10px' }}
                  >
                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={`https://media.api-sports.io/football/teams/${team.team.id}.png`}
                        alt={`${team.team.name} Logo`} 
                        style={{ width: '25px', marginRight: '10px' }}
                      />
                      <Typography>
                        {team.team.name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
        </div>
    );
}

export default LeagueList;